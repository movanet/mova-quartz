/* =============================================================================
 * ISLA NOVA — DINO PATROL
 * An original, fan-made homage to 2015-era dinosaur-park arcade rail shooters.
 * Everything (3D models, terrain, audio, UI) is generated procedurally here;
 * the only dependency is three.js r128 loaded from a CDN.
 * ========================================================================== */

(() => {
  "use strict";

  if (typeof THREE === "undefined") {
    document.getElementById("loading").textContent = "THREE.JS FAILED TO LOAD — CHECK NETWORK";
    return;
  }

  // ---------------------------------------------------------------------------
  // Small helpers
  // ---------------------------------------------------------------------------
  const $ = (id) => document.getElementById(id);
  const rand = (a, b) => a + Math.random() * (b - a);
  const randInt = (a, b) => Math.floor(rand(a, b + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const TAU = Math.PI * 2;

  // Deterministic-ish value noise for terrain wobble.
  function noise2(x, z) {
    return (
      Math.sin(x * 0.13) * Math.cos(z * 0.11) * 0.6 +
      Math.sin(x * 0.37 + z * 0.21) * 0.25 +
      Math.cos(z * 0.53 - x * 0.31) * 0.15
    );
  }

  // ---------------------------------------------------------------------------
  // Audio — every sound is synthesised, no asset files.
  // ---------------------------------------------------------------------------
  const Audio = {
    ctx: null,
    master: null,
    muted: false,
    noiseBuf: null,

    init() {
      if (this.ctx) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(this.ctx.destination);

      const len = this.ctx.sampleRate * 2;
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      this.noiseBuf = buf;
    },

    resume() {
      if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
    },

    toggleMute() {
      this.muted = !this.muted;
      if (this.master) this.master.gain.value = this.muted ? 0 : 0.5;
      return this.muted;
    },

    tone(freq, dur, type = "sine", gain = 0.3, slideTo = null) {
      if (!this.ctx || this.muted) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t + dur);
      g.gain.setValueAtTime(gain, t);
      g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
      osc.connect(g).connect(this.master);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    },

    noise(dur, gain = 0.25, filterFreq = 1200, q = 1, sweepTo = null) {
      if (!this.ctx || this.muted) return;
      const t = this.ctx.currentTime;
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuf;
      const filt = this.ctx.createBiquadFilter();
      filt.type = "bandpass";
      filt.frequency.setValueAtTime(filterFreq, t);
      filt.Q.value = q;
      if (sweepTo) filt.frequency.exponentialRampToValueAtTime(Math.max(40, sweepTo), t + dur);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(gain, t);
      g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
      src.connect(filt).connect(g).connect(this.master);
      src.start(t);
      src.stop(t + dur + 0.02);
    },

    shot() {
      this.noise(0.14, 0.32, 2600, 0.8, 300);
      this.tone(680, 0.09, "square", 0.1, 190);
    },
    dryFire() { this.tone(160, 0.05, "square", 0.16, 90); },
    reload() {
      this.tone(320, 0.06, "square", 0.13, 200);
      setTimeout(() => this.tone(240, 0.07, "square", 0.13, 420), 260);
      setTimeout(() => this.noise(0.07, 0.16, 1800, 2), 620);
    },
    hit() { this.noise(0.09, 0.24, 900, 3); this.tone(420, 0.06, "triangle", 0.12, 240); },
    crit() { this.tone(1180, 0.13, "square", 0.14, 620); this.noise(0.1, 0.2, 2400, 3); },
    down(pitch = 1) {
      this.tone(300 * pitch, 0.55, "sawtooth", 0.16, 60 * pitch);
      this.noise(0.5, 0.16, 500, 1, 90);
    },
    roar(pitch = 1) {
      this.tone(120 * pitch, 1.0, "sawtooth", 0.2, 52 * pitch);
      this.tone(78 * pitch, 1.1, "square", 0.13, 40 * pitch);
      this.noise(0.95, 0.16, 420 * pitch, 1.2, 130);
    },
    screech() { this.tone(1400, 0.4, "sawtooth", 0.11, 420); this.noise(0.3, 0.1, 3000, 2, 800); },
    hurt() { this.noise(0.35, 0.4, 260, 0.7, 70); this.tone(90, 0.35, "square", 0.2, 45); },
    pickup() { this.tone(660, 0.09, "square", 0.16); setTimeout(() => this.tone(990, 0.13, "square", 0.16), 90); },
    rescue() {
      [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => this.tone(f, 0.16, "triangle", 0.16), i * 90));
    },
    stage() {
      [392, 523, 659].forEach((f, i) => setTimeout(() => this.tone(f, 0.28, "square", 0.14), i * 150));
    },
    gameover() {
      [330, 294, 247, 165].forEach((f, i) => setTimeout(() => this.tone(f, 0.5, "sawtooth", 0.16), i * 260));
    },
    thunder() { this.noise(1.4, 0.22, 160, 0.5, 40); },
  };

  // ---------------------------------------------------------------------------
  // Renderer / scene scaffolding
  // ---------------------------------------------------------------------------
  const app = $("app");
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  app.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 900);
  const cameraRig = new THREE.Object3D(); // carries position + look direction
  cameraRig.add(camera);
  scene.add(cameraRig);

  // Lighting rigs are rebuilt per zone (different times of day).
  let hemi, sun, fillLight, lightningLight;

  const worldGroup = new THREE.Group(); // everything that gets rebuilt per zone
  scene.add(worldGroup);

  // Point an object's local -Z (the camera's viewing axis) along a horizontal
  // direction. Object3D.lookAt() aims +Z for non-cameras, which would flip the
  // rig, so the yaw is computed directly.
  function faceAlong(obj, dx, dz) {
    obj.rotation.set(0, Math.atan2(-dx, -dz), 0);
  }

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", resize);

  // Shared geometry / material caches keep allocation down.
  const GEO = {
    box: new THREE.BoxGeometry(1, 1, 1),
    sphere: new THREE.SphereGeometry(0.5, 10, 8),
    cone: new THREE.ConeGeometry(0.5, 1, 8),
    cyl: new THREE.CylinderGeometry(0.5, 0.5, 1, 8),
    rock: new THREE.IcosahedronGeometry(1, 0),
    disc: new THREE.CircleGeometry(1, 16),
  };

  function mat(color, opts = {}) {
    return new THREE.MeshLambertMaterial(Object.assign({ color }, opts));
  }

  function box(w, h, d, color, x = 0, y = 0, z = 0) {
    const m = new THREE.Mesh(GEO.box, color instanceof THREE.Material ? color : mat(color));
    m.scale.set(w, h, d);
    m.position.set(x, y, z);
    return m;
  }
  function ball(r, color, x = 0, y = 0, z = 0) {
    const m = new THREE.Mesh(GEO.sphere, color instanceof THREE.Material ? color : mat(color));
    m.scale.setScalar(r * 2);
    m.position.set(x, y, z);
    return m;
  }
  function cone(r, h, color, x = 0, y = 0, z = 0) {
    const m = new THREE.Mesh(GEO.cone, color instanceof THREE.Material ? color : mat(color));
    m.scale.set(r * 2, h, r * 2);
    m.position.set(x, y, z);
    return m;
  }
  function cyl(r, h, color, x = 0, y = 0, z = 0) {
    const m = new THREE.Mesh(GEO.cyl, color instanceof THREE.Material ? color : mat(color));
    m.scale.set(r * 2, h, r * 2);
    m.position.set(x, y, z);
    return m;
  }

  // ---------------------------------------------------------------------------
  // Procedural dinosaur models. Every animal faces +Z, feet on y = 0.
  // Each builder returns { group, parts } where parts are animated in update().
  // ---------------------------------------------------------------------------
  function crit(mesh) { mesh.userData.crit = true; return mesh; }

  function stripes(parent, color, count, len, y, z0, dz) {
    const m = mat(color);
    for (let i = 0; i < count; i++) {
      parent.add(box(len, 0.06, 0.16, m, 0, y, z0 + i * dz));
    }
  }

  function teeth(jaw, count, r, zStart, dz, up) {
    const m = mat(0xf2ede0);
    for (let i = 0; i < count; i++) {
      const t = cone(r, r * 2.6, m, 0.12, up, zStart + i * dz);
      t.rotation.x = Math.PI;
      t.rotation.z = up > 0 ? 0 : Math.PI;
      jaw.add(t);
      const t2 = t.clone();
      t2.position.x = -0.12;
      jaw.add(t2);
    }
  }

  function blobShadow(group, radius) {
    const s = new THREE.Mesh(
      GEO.disc,
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.32, depthWrite: false })
    );
    s.rotation.x = -Math.PI / 2;
    s.scale.setScalar(radius);
    s.position.y = 0.03;
    s.userData.noHit = true;
    group.add(s);
    return s;
  }

  /* ----------------------------- Raptor / Compy ---------------------------- */
  function buildRaptor(pal) {
    const g = new THREE.Group();
    const skin = mat(pal.skin);
    const belly = mat(pal.belly);

    // Horizontal theropod posture: hips carry a level torso, the neck rises
    // from the chest and the tail counterbalances behind.
    const torso = new THREE.Group();
    torso.position.set(0, 1.38, 0);
    torso.rotation.x = 0.09;
    g.add(torso);
    const body = box(0.72, 0.78, 2.0, skin, 0, 0, 0.1);
    torso.add(body);
    torso.add(box(0.62, 0.32, 1.55, belly, 0, -0.3, 0.15));
    torso.add(box(0.8, 0.56, 0.8, skin, 0, 0.04, 0.9));          // chest
    const stripeM = mat(pal.stripe);
    for (let i = 0; i < 5; i++) torso.add(box(0.76, 0.06, 0.16, stripeM, 0, 0.4, -0.62 + i * 0.38));

    // neck
    const neck = new THREE.Group();
    neck.position.set(0, 0.3, 1.18);
    neck.rotation.x = 0.5;
    torso.add(neck);
    neck.add(box(0.32, 0.88, 0.36, skin, 0, 0.36, 0));

    // head
    const head = new THREE.Group();
    head.position.set(0, 0.8, 0.02);
    head.rotation.x = -0.72;
    neck.add(head);
    const skull = box(0.38, 0.38, 0.58, skin, 0, 0, 0.16);
    crit(skull); head.add(skull);
    const snout = box(0.29, 0.25, 0.52, skin, 0, -0.04, 0.66);
    crit(snout); head.add(snout);
    const jaw = new THREE.Group();
    jaw.position.set(0, -0.17, 0.22);
    head.add(jaw);
    const jawMesh = box(0.27, 0.14, 0.66, skin, 0, -0.02, 0.34);
    crit(jawMesh); jaw.add(jawMesh);
    teeth(jaw, 3, 0.04, 0.2, 0.18, 0.08);
    const eyeM = new THREE.MeshBasicMaterial({ color: pal.eye });
    [-1, 1].forEach((sd) => {
      const e = ball(0.07, eyeM, sd * 0.19, 0.11, 0.3);
      e.userData.noHit = true;
      head.add(e);
    });
    const q = mat(pal.crest);
    for (let i = 0; i < 3; i++) {
      const f = cone(0.07, 0.36, q, 0, 0.2 + i * 0.02, -0.06 - i * 0.15);
      f.rotation.x = -1.0;
      head.add(f);
    }

    // tail
    const tail = new THREE.Group();
    tail.position.set(0, 0.14, -0.92);
    torso.add(tail);
    let seg = tail;
    const tailSegs = [];
    for (let i = 0; i < 4; i++) {
      const sg = new THREE.Group();
      sg.position.z = -0.48;
      sg.rotation.x = -0.05;
      const w = 0.52 - i * 0.1;
      sg.add(box(w, w, 0.54, skin, 0, 0, -0.24));
      seg.add(sg);
      tailSegs.push(sg);
      seg = sg;
    }

    // legs
    const legs = [];
    [-1, 1].forEach((side) => {
      const hip = new THREE.Group();
      hip.position.set(side * 0.33, -0.26, -0.12);
      torso.add(hip);
      hip.add(box(0.34, 0.66, 0.44, skin, 0, -0.3, 0));
      const knee = new THREE.Group();
      knee.position.set(0, -0.58, 0);
      hip.add(knee);
      knee.add(box(0.23, 0.6, 0.25, skin, 0, -0.29, -0.05));
      const ankle = new THREE.Group();
      ankle.position.set(0, -0.54, -0.05);
      knee.add(ankle);
      ankle.add(box(0.19, 0.15, 0.46, skin, 0, -0.07, 0.15));
      const claw = cone(0.05, 0.22, mat(0x2a2622), 0, -0.09, 0.38);
      claw.rotation.x = Math.PI / 2;
      ankle.add(claw);
      legs.push({ hip, knee, ankle, side });
    });

    // arms
    const arms = [];
    [-1, 1].forEach((side) => {
      const sh = new THREE.Group();
      sh.position.set(side * 0.4, 0.1, 0.86);
      torso.add(sh);
      sh.add(box(0.16, 0.44, 0.16, skin, 0, -0.2, 0.06));
      const fore = new THREE.Group();
      fore.position.set(0, -0.4, 0.06);
      sh.add(fore);
      fore.add(box(0.13, 0.36, 0.13, skin, 0, -0.15, 0.12));
      fore.rotation.x = -1.2;
      arms.push({ sh, fore, side });
    });

    blobShadow(g, 1.2);
    return { group: g, parts: { body, torso, neck, head, jaw, tail: tailSegs, legs, arms }, height: 2.5 };
  }

  /* --------------------------- Dilophosaurus ------------------------------- */
  function buildDilo(pal) {
    const r = buildRaptor(pal);
    const head = r.parts.head;
    // twin crests
    const cm = mat(pal.crest);
    [-1, 1].forEach((s) => {
      const fan = box(0.05, 0.34, 0.42, cm, s * 0.12, 0.24, 0.14);
      fan.rotation.z = s * 0.22;
      head.add(fan);
    });
    // neck frill (opens when spitting)
    const frill = new THREE.Group();
    frill.position.set(0, 0.02, -0.16);
    head.add(frill);
    const fm = new THREE.MeshLambertMaterial({ color: pal.frill, side: THREE.DoubleSide });
    [-1, 1].forEach((s) => {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.62), fm);
      p.position.set(s * 0.3, 0.05, -0.1);
      p.rotation.y = s * 0.9;
      frill.add(p);
    });
    frill.scale.setScalar(0.02);
    r.parts.frill = frill;
    return r;
  }

  /* ----------------------------- Pteranodon -------------------------------- */
  function buildPtero(pal) {
    const g = new THREE.Group();
    const skin = mat(pal.skin);
    const memb = new THREE.MeshLambertMaterial({ color: pal.wing, side: THREE.DoubleSide });

    const body = box(0.5, 0.5, 1.5, skin, 0, 0, 0);
    g.add(body);
    const head = new THREE.Group();
    head.position.set(0, 0.14, 0.72);
    g.add(head);
    const skull = box(0.28, 0.3, 0.4, skin, 0, 0, 0.1);
    crit(skull); head.add(skull);
    const beak = cone(0.11, 1.05, mat(pal.beak), 0, -0.02, 0.72);
    beak.rotation.x = Math.PI / 2;
    crit(beak); head.add(beak);
    const jaw = new THREE.Group(); head.add(jaw);
    const crestM = cone(0.1, 0.7, mat(pal.crest), 0, 0.16, -0.16);
    crestM.rotation.x = 2.5;
    head.add(crestM);
    const eyeM = new THREE.MeshBasicMaterial({ color: pal.eye });
    [-1, 1].forEach((s) => { const e = ball(0.05, eyeM, s * 0.14, 0.06, 0.16); e.userData.noHit = true; head.add(e); });

    const wings = [];
    [-1, 1].forEach((side) => {
      const sh = new THREE.Group();
      sh.position.set(side * 0.24, 0.12, 0.15);
      g.add(sh);
      const inner = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.95), memb);
      inner.rotation.x = -Math.PI / 2;
      inner.position.set(side * 0.85, 0, -0.1);
      sh.add(inner);
      const bone = cyl(0.055, 1.75, skin, side * 0.85, 0.03, 0.2);
      bone.rotation.z = Math.PI / 2;
      sh.add(bone);
      const outer = new THREE.Group();
      outer.position.set(side * 1.7, 0, 0);
      sh.add(outer);
      const ow = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.8), memb);
      ow.rotation.x = -Math.PI / 2;
      ow.position.set(side * 0.75, 0, -0.14);
      outer.add(ow);
      wings.push({ sh, outer, side });
    });

    const tail = new THREE.Group();
    tail.position.set(0, 0, -0.75);
    g.add(tail);
    const tb = cyl(0.07, 1.0, skin, 0, 0, -0.5);
    tb.rotation.x = Math.PI / 2;
    tail.add(tb);
    const legs = [];
    [-1, 1].forEach((side) => {
      const l = new THREE.Group();
      l.position.set(side * 0.18, -0.2, -0.3);
      g.add(l);
      l.add(box(0.1, 0.5, 0.1, skin, 0, -0.24, 0));
      legs.push({ hip: l, knee: l, ankle: l, side });
    });

    return { group: g, parts: { body, head, jaw, wings, tail: [tail], legs, arms: [] }, height: 0.0, flying: true };
  }

  /* ---------------------------- Triceratops -------------------------------- */
  function buildTrike(pal) {
    const g = new THREE.Group();
    const skin = mat(pal.skin);
    const body = box(1.7, 1.5, 3.2, skin, 0, 1.7, 0);
    g.add(body);
    g.add(box(1.5, 0.7, 2.6, mat(pal.belly), 0, 1.12, 0));
    stripes(g, pal.stripe, 4, 1.75, 2.3, -0.9, 0.55);

    const head = new THREE.Group();
    head.position.set(0, 1.55, 1.7);
    g.add(head);
    const frill = new THREE.Mesh(GEO.cyl, mat(pal.frill));
    frill.scale.set(2.5, 0.22, 2.3);
    frill.rotation.x = Math.PI / 2 - 0.25;
    frill.position.set(0, 0.35, -0.05);
    crit(frill); head.add(frill);
    const skull = box(0.85, 0.72, 1.35, skin, 0, 0, 0.6);
    crit(skull); head.add(skull);
    const beak = cone(0.3, 0.6, mat(pal.beak), 0, -0.14, 1.3);
    beak.rotation.x = Math.PI / 2;
    crit(beak); head.add(beak);
    const hm = mat(0xe8e2d2);
    [-1, 1].forEach((s) => {
      const h = cone(0.12, 1.25, hm, s * 0.36, 0.35, 0.9);
      h.rotation.x = -0.7;
      crit(h); head.add(h);
    });
    const nose = cone(0.13, 0.5, hm, 0, 0.3, 1.05);
    nose.rotation.x = -0.3;
    crit(nose); head.add(nose);
    const eyeM = new THREE.MeshBasicMaterial({ color: pal.eye });
    [-1, 1].forEach((s) => { const e = ball(0.07, eyeM, s * 0.42, 0.1, 0.72); e.userData.noHit = true; head.add(e); });

    const tail = new THREE.Group();
    tail.position.set(0, 1.75, -1.6);
    g.add(tail);
    let seg = tail; const segs = [];
    for (let i = 0; i < 3; i++) {
      const s = new THREE.Group();
      s.position.z = -0.45;
      const w = 0.8 - i * 0.2;
      s.add(box(w, w, 0.5, skin, 0, -0.05, -0.22));
      seg.add(s); segs.push(s); seg = s;
    }

    const legs = [];
    [[-1, 1.1], [1, 1.1], [-1, -1.0], [1, -1.0]].forEach(([side, z]) => {
      const hip = new THREE.Group();
      hip.position.set(side * 0.72, 1.3, z);
      g.add(hip);
      hip.add(box(0.46, 0.8, 0.55, skin, 0, -0.36, 0));
      const knee = new THREE.Group();
      knee.position.set(0, -0.72, 0);
      hip.add(knee);
      knee.add(box(0.4, 0.62, 0.45, skin, 0, -0.3, 0));
      const ankle = new THREE.Group();
      ankle.position.set(0, -0.58, 0);
      knee.add(ankle);
      ankle.add(box(0.44, 0.2, 0.5, mat(0x3b352c), 0, -0.08, 0.03));
      legs.push({ hip, knee, ankle, side, z });
    });

    blobShadow(g, 2.1);
    return { group: g, parts: { body, head, jaw: head, tail: segs, legs, arms: [] }, height: 3.0 };
  }

  /* ------------------------------ Tyrannosaur ------------------------------ */
  function buildRex(pal) {
    const g = new THREE.Group();
    const skin = mat(pal.skin);
    const belly = mat(pal.belly);

    const torso = new THREE.Group();
    torso.position.set(0, 4.0, 0);
    torso.rotation.x = 0.07;
    g.add(torso);
    const body = box(2.2, 2.4, 5.0, skin, 0, 0, 0.3);
    torso.add(body);
    torso.add(box(1.8, 1.0, 4.0, belly, 0, -0.95, 0.35));
    torso.add(box(2.3, 1.7, 1.7, skin, 0, 0.1, 2.4));          // chest
    const stripeM = mat(pal.stripe);
    for (let i = 0; i < 6; i++) torso.add(box(2.3, 0.14, 0.4, stripeM, 0, 1.2, -1.7 + i * 0.8));

    const neck = new THREE.Group();
    neck.position.set(0, 0.85, 2.75);
    neck.rotation.x = 0.45;
    torso.add(neck);
    neck.add(box(1.15, 1.7, 1.25, skin, 0, 0.75, 0));

    const head = new THREE.Group();
    head.position.set(0, 1.55, 0.1);
    head.rotation.x = -0.68;
    neck.add(head);
    const skull = box(1.05, 1.15, 2.0, skin, 0, 0.05, 0.7);
    crit(skull); head.add(skull);
    const brow = box(1.16, 0.24, 0.9, stripeM, 0, 0.6, 0.5);
    crit(brow); head.add(brow);
    const snout = box(0.85, 0.66, 1.0, skin, 0, 0, 1.85);
    crit(snout); head.add(snout);

    const jaw = new THREE.Group();
    jaw.position.set(0, -0.48, 0.25);
    head.add(jaw);
    const jm = box(0.9, 0.42, 2.1, skin, 0, -0.08, 1.05);
    jm.userData.mouth = true; crit(jm); jaw.add(jm);
    const tongue = box(0.52, 0.1, 1.4, mat(0x9c4a55), 0, 0.1, 1.0);
    tongue.userData.mouth = true; jaw.add(tongue);
    const tm = mat(0xf4efe2);
    for (let i = 0; i < 7; i++) {
      [-1, 1].forEach((sd) => {
        const up = cone(0.1, 0.44, tm, sd * 0.42, -0.46, 0.5 + i * 0.28);
        up.rotation.x = Math.PI;
        head.add(up);
        const lo = cone(0.09, 0.36, tm, sd * 0.4, 0.22, 0.5 + i * 0.28);
        lo.userData.mouth = true;
        jaw.add(lo);
      });
    }
    const eyeM = new THREE.MeshBasicMaterial({ color: pal.eye });
    [-1, 1].forEach((sd) => {
      const e = ball(0.16, eyeM, sd * 0.5, 0.42, 1.1);
      e.userData.noHit = true;
      head.add(e);
    });

    const tail = new THREE.Group();
    tail.position.set(0, 0.25, -2.4);
    torso.add(tail);
    let seg = tail;
    const segs = [];
    for (let i = 0; i < 5; i++) {
      const sg = new THREE.Group();
      sg.position.z = -1.05;
      sg.rotation.x = -0.06;
      const w = 1.5 - i * 0.25;
      sg.add(box(w, w, 1.15, skin, 0, 0, -0.52));
      seg.add(sg); segs.push(sg); seg = sg;
    }

    const legs = [];
    [-1, 1].forEach((side) => {
      const hip = new THREE.Group();
      hip.position.set(side * 0.95, -0.7, -0.35);
      torso.add(hip);
      hip.add(box(1.05, 1.9, 1.35, skin, 0, -0.9, 0));
      const knee = new THREE.Group();
      knee.position.set(0, -1.75, 0);
      hip.add(knee);
      knee.add(box(0.72, 1.6, 0.82, skin, 0, -0.8, -0.15));
      const ankle = new THREE.Group();
      ankle.position.set(0, -1.6, -0.15);
      knee.add(ankle);
      ankle.add(box(0.64, 0.4, 1.5, skin, 0, -0.2, 0.45));
      [-1, 0, 1].forEach((t) => {
        const c = cone(0.11, 0.5, mat(0x2b2723), t * 0.2, -0.3, 1.16);
        c.rotation.x = Math.PI / 2;
        ankle.add(c);
      });
      legs.push({ hip, knee, ankle, side });
    });

    const arms = [];
    [-1, 1].forEach((side) => {
      const sh = new THREE.Group();
      sh.position.set(side * 1.1, 0.5, 2.3);
      torso.add(sh);
      sh.add(box(0.34, 0.72, 0.34, skin, 0, -0.34, 0));
      const fore = new THREE.Group();
      fore.position.set(0, -0.64, 0);
      sh.add(fore);
      fore.add(box(0.26, 0.58, 0.26, skin, 0, -0.26, 0.14));
      fore.rotation.x = -1.3;
      arms.push({ sh, fore, side });
    });

    blobShadow(g, 3.4);
    return { group: g, parts: { body, torso, neck, head, jaw, tail: segs, legs, arms }, height: 7.0 };
  }

  // ---------------------------------------------------------------------------
  // Species table — stats, palettes and behaviour class for every animal.
  // ---------------------------------------------------------------------------
  const DINO_TYPES = {
    compy: {
      label: "COMPSOGNATHUS", build: buildRaptor, ai: "stalk", scale: 0.42,
      pal: { skin: 0x8f9c4d, belly: 0xd8d5a0, stripe: 0x5c6630, crest: 0xc2a53c, eye: 0xff4c2b },
      hp: 10, speed: 7.8, score: 70, range: 3.4, dmg: 3, cd: 2.6, bar: false,
    },
    raptor: {
      label: "VELOCIRAPTOR", build: buildRaptor, ai: "stalk", scale: 1,
      pal: { skin: 0x4e6b45, belly: 0xc9c4a0, stripe: 0x2d3d28, crest: 0xb8532f, eye: 0xffd23c },
      hp: 38, speed: 8.0, score: 200, range: 5.6, dmg: 9, cd: 2.4, bar: true,
    },
    raptorAlpha: {
      label: "ALPHA RAPTOR", build: buildRaptor, ai: "stalk", scale: 1.25,
      pal: { skin: 0x6b5230, belly: 0xd6c79c, stripe: 0x33261a, crest: 0xe0a12c, eye: 0x9cff4c },
      hp: 90, speed: 9.4, score: 450, range: 6.2, dmg: 14, cd: 1.3, bar: true,
    },
    dilo: {
      label: "DILOPHOSAURUS", build: buildDilo, ai: "spitter", scale: 0.95,
      pal: { skin: 0x3f6357, belly: 0xd9cfa8, stripe: 0x24382f, crest: 0xe2603c, frill: 0xf0a83c, eye: 0xff3b30 },
      hp: 32, speed: 4.6, score: 260, range: 22, dmg: 12, cd: 2.6, bar: true,
    },
    ptero: {
      label: "PTERANODON", build: buildPtero, ai: "flyer", scale: 1.1,
      pal: { skin: 0x9a8a72, wing: 0x6f6154, beak: 0xd8cdb4, crest: 0xb2452f, eye: 0xffd23c },
      hp: 24, speed: 13, score: 320, range: 3.5, dmg: 10, cd: 2.6, bar: true, assist: 1.45,
    },
    trike: {
      label: "TRICERATOPS", build: buildTrike, ai: "charger", scale: 1,
      pal: { skin: 0x77664f, belly: 0xbfae8c, stripe: 0x4a3f30, frill: 0x8c7658, beak: 0xd9cfb8, eye: 0xffb03c },
      hp: 150, speed: 12, score: 700, range: 6.5, dmg: 22, cd: 3.0, bar: true, armor: 0.45,
    },
    rex: {
      label: "TYRANNOSAURUS REX", build: buildRex, ai: "boss", scale: 1,
      pal: { skin: 0x5a4a3a, belly: 0xa8977c, stripe: 0x342a20, eye: 0xffcf3c },
      hp: 1200, speed: 6.5, score: 6000, range: 12, dmg: 22, cd: 3.0, bar: true, boss: true, armor: 0.5,
    },
  };

  // ---------------------------------------------------------------------------
  // Live world state
  // ---------------------------------------------------------------------------
  const enemies = [];
  const pickups = [];
  const venom = [];
  const fx = [];           // transient visual effects with an update(dt) → bool
  let hitTargets = [];     // Object3Ds the crosshair ray can strike

  const tmpV = new THREE.Vector3();
  const tmpV2 = new THREE.Vector3();

  function addTarget(obj) { hitTargets.push(obj); }
  function removeTarget(obj) {
    const i = hitTargets.indexOf(obj);
    if (i >= 0) hitTargets.splice(i, 1);
  }

  function disposeGroup(g) {
    g.traverse((o) => {
      if (o.isMesh || o.isSprite) {
        if (o.geometry && !Object.values(GEO).includes(o.geometry)) o.geometry.dispose();
      }
    });
    if (g.parent) g.parent.remove(g);
  }

  // ---------------------------------------------------------------------------
  // Dino — one live animal
  // ---------------------------------------------------------------------------
  class Dino {
    constructor(type, pos, opts = {}) {
      const cfg = DINO_TYPES[type];
      const built = cfg.build(cfg.pal);
      this.type = type;
      this.cfg = cfg;
      this.parts = built.parts;
      this.flying = !!built.flying;
      this.group = built.group;
      this.group.scale.setScalar(cfg.scale);
      this.group.position.copy(pos);
      this.group.userData.dinoRef = this;

      this.maxhp = Math.round(cfg.hp * (opts.hpMul || 1));
      this.hp = this.maxhp;
      this.speed = cfg.speed * (opts.speedMul || 1);
      this.state = "approach";
      this.stateT = 0;
      this.walk = rand(0, TAU);
      this.bob = rand(0, TAU);
      this.attackCd = rand(0.5, 1.6);
      this.flinch = 0;
      this.dead = false;
      this.alerted = false;
      this.orbitDir = Math.random() < 0.5 ? -1 : 1;
      this.height = (built.height || 2) * cfg.scale;

      if (cfg.bar) this.makeBar();
      worldGroup.add(this.group);
      enemies.push(this);
      addTarget(this.group);
    }

    makeBar() {
      const back = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0x220b0b, depthTest: false, transparent: true, opacity: 0.85 }));
      const front = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0x4ce08a, depthTest: false }));
      const w = this.cfg.boss ? 6 : 1.15;
      back.scale.set(w, w * 0.09, 1);
      front.scale.set(w, w * 0.07, 1);
      back.renderOrder = 999; front.renderOrder = 1000;
      back.userData.noHit = front.userData.noHit = true;
      const y = (this.height + 0.7) / this.cfg.scale;
      back.position.set(0, y, 0);
      front.position.set(0, y, 0.01);
      this.group.add(back, front);
      this.bar = { back, front, w };
      this.updateBar();
    }

    updateBar() {
      if (!this.bar) return;
      const f = clamp(this.hp / this.maxhp, 0, 1);
      this.bar.front.scale.x = this.bar.w * f;
      this.bar.front.position.x = -this.bar.w * (1 - f) * 0.5;
      this.bar.front.material.color.setHex(f > 0.5 ? 0x4ce08a : f > 0.22 ? 0xffc23c : 0xff3b30);
      const vis = !!(this.hp < this.maxhp || this.cfg.boss);
      this.bar.front.visible = this.bar.back.visible = vis && !this.dead;
    }

    // Aim point used for AI + the reticle "hot" state.
    center(out) {
      return out.copy(this.group.position).setY(this.group.position.y + this.height * 0.55);
    }

    damage(amount, isCrit, point) {
      if (this.dead) return;
      const armor = this.cfg.armor && !isCrit ? 1 - this.cfg.armor : 1;
      const dealt = Math.max(1, Math.round(amount * armor));
      this.hp -= dealt;
      this.flinch = 0.16;
      this.alerted = true;
      this.updateBar();
      spawnDart(this.group, point);
      Game.showFloater(point, (isCrit ? "CRIT " : "") + dealt, isCrit ? "crit" : "");
      if (this.hp <= 0) this.die();
      return dealt;
    }

    die() {
      this.dead = true;
      this.state = "down";
      this.stateT = 0;
      removeTarget(this.group);
      if (this.bar) { this.bar.front.visible = false; this.bar.back.visible = false; }
      Audio.down(this.cfg.boss ? 0.5 : this.cfg.scale < 0.6 ? 2 : 1);
      Game.onKill(this);
    }

    /* -------------------------- animation helpers ------------------------- */
    animWalk(dt, rate) {
      this.walk += dt * rate;
      const legs = this.parts.legs || [];
      legs.forEach((l, i) => {
        const quad = l.z !== undefined;
        const off = quad ? (l.z > 0 ? 0 : Math.PI) + (l.side > 0 ? Math.PI : 0) : (i % 2 ? Math.PI : 0);
        const s = Math.sin(this.walk + off);
        const c = Math.cos(this.walk + off);
        l.hip.rotation.x = s * 0.62;
        if (l.knee !== l.hip) l.knee.rotation.x = Math.max(0, c) * 0.7 + 0.15;
        if (l.ankle !== l.hip) l.ankle.rotation.x = -s * 0.3;
      });
      // tail sway
      const tail = this.parts.tail || [];
      tail.forEach((t, i) => {
        t.rotation.y = Math.sin(this.walk * 0.5 - i * 0.5) * 0.16;
        t.rotation.x = Math.sin(this.walk * 0.5 - i * 0.4) * 0.05;
      });
      // arms
      (this.parts.arms || []).forEach((a, i) => {
        a.sh.rotation.x = Math.sin(this.walk + i * Math.PI) * 0.25 - 0.3;
      });
      if (this.parts.body) this.parts.body.position.y += 0; // (bob applied on group)
    }

    animFly(dt) {
      this.walk += dt * 7;
      (this.parts.wings || []).forEach((w) => {
        w.sh.rotation.z = Math.sin(this.walk) * 0.75 * -w.side;
        w.outer.rotation.z = Math.sin(this.walk - 0.7) * 0.6 * -w.side;
      });
    }

    faceTo(target, dt, rate = 4) {
      const dx = target.x - this.group.position.x;
      const dz = target.z - this.group.position.z;
      const want = Math.atan2(dx, dz);
      let d = want - this.group.rotation.y;
      while (d > Math.PI) d -= TAU;
      while (d < -Math.PI) d += TAU;
      this.group.rotation.y += d * Math.min(1, dt * rate);
    }

    openJaw(v) {
      if (this.parts.jaw && this.parts.jaw.rotation) this.parts.jaw.rotation.x = v;
    }

    strike(dmg) {
      Game.damagePlayer(dmg, this);
    }

    /* ------------------------------- update ------------------------------- */
    update(dt, player) {
      if (this.flinch > 0) this.flinch -= dt;
      this.stateT += dt;
      const g = this.group;

      if (this.state === "down") {
        // collapse and sink
        const t = Math.min(1, this.stateT / 0.9);
        g.rotation.z = lerp(0, (this.orbitDir > 0 ? 1 : -1) * Math.PI * 0.42, t);
        g.position.y = lerp(this.spawnY || 0, (this.spawnY || 0) - 0.25, t);
        if (this.flying) g.position.y = Math.max(0.4, g.position.y - dt * 9);
        this.openJaw(0.4);
        if (this.stateT > 2.4) {
          g.scale.multiplyScalar(Math.max(0.001, 1 - dt * 3));
          if (this.stateT > 3.2) this.remove();
        }
        return;
      }

      const dist = Math.hypot(player.x - g.position.x, player.z - g.position.z);
      this.keepInView(dt, player, dist);
      this.attackCd -= dt;
      switch (this.cfg.ai) {
        case "stalk": this.aiStalk(dt, player, dist); break;
        case "spitter": this.aiSpitter(dt, player, dist); break;
        case "flyer": this.aiFlyer(dt, player, dist); break;
        case "charger": this.aiCharger(dt, player, dist); break;
        case "boss": this.aiBoss(dt, player, dist); break;
      }

      // Animals that fall far behind the jeep give up and leave.
      if (dist > 130) this.remove();
    }

    // The rifle only covers the road ahead, so anything that wanders behind the
    // jeep is walked back around into the frontal arc.
    keepInView(dt, player, dist) {
      if (dist < 1.2) return;
      const f = Game.forward;
      const dx = (this.group.position.x - player.x) / dist;
      const dz = (this.group.position.z - player.z) / dist;
      const cosA = dx * f.x + dz * f.z;
      if (cosA > 0.42) return;
      const ang = dt * 1.5;
      const sn = Math.sin(ang), cs = Math.cos(ang);
      const ax = dx * cs - dz * sn, az = dx * sn + dz * cs;
      const bx = dx * cs + dz * sn, bz = -dx * sn + dz * cs;
      const useA = ax * f.x + az * f.z > bx * f.x + bz * f.z;
      const nx = useA ? ax : bx, nz = useA ? az : bz;
      this.group.position.x = player.x + nx * dist;
      this.group.position.z = player.z + nz * dist;
    }

    moveToward(target, dt, speed, stopAt) {
      const g = this.group;
      tmpV.set(target.x - g.position.x, 0, target.z - g.position.z);
      const d = tmpV.length();
      if (d > stopAt) {
        tmpV.normalize().multiplyScalar(Math.min(speed * dt, d - stopAt));
        g.position.add(tmpV);
      }
      return d;
    }

    aiStalk(dt, player, dist) {
      const g = this.group;
      this.faceTo(player, dt, 3.5);
      if (this.state === "approach") {
        // weave in as they close
        const weave = Math.sin(this.stateT * 2.2 + this.bob) * this.orbitDir;
        g.position.x += weave * dt * 2.4;
        this.moveToward(player, dt, this.speed * (this.flinch > 0 ? 0.35 : 1), this.cfg.range);
        this.animWalk(dt, 9 + this.speed * 0.4);
        g.position.y = Math.abs(Math.sin(this.walk)) * 0.12;
        this.openJaw(0.15 + Math.sin(this.stateT * 3) * 0.08);
        if (dist <= this.cfg.range + 0.5 && this.attackCd <= 0) {
          this.state = "lunge"; this.stateT = 0;
        }
      } else if (this.state === "lunge") {
        const t = this.stateT;
        this.openJaw(clamp(t * 6, 0, 0.9));
        g.position.y = Math.sin(clamp(t / 0.45, 0, 1) * Math.PI) * 1.1;
        this.moveToward(player, dt, this.speed * 1.3, 2.4);
        if (t > 0.32 && !this.didHit) {
          this.didHit = true;
          if (dist < this.cfg.range + 2.5) this.strike(this.cfg.dmg);
        }
        if (t > 0.75) {
          this.didHit = false;
          this.state = "approach"; this.stateT = 0;
          this.attackCd = this.cfg.cd * rand(0.8, 1.4);
          // hop back so it does not sit inside the jeep
          tmpV.set(g.position.x - player.x, 0, g.position.z - player.z).normalize().multiplyScalar(3.4);
          g.position.add(tmpV);
        }
      }
    }

    aiSpitter(dt, player, dist) {
      const g = this.group;
      this.faceTo(player, dt, 2.6);
      const frill = this.parts.frill;
      if (this.state === "approach") {
        this.moveToward(player, dt, this.speed, this.cfg.range * 0.75);
        this.animWalk(dt, 7);
        g.position.y = Math.abs(Math.sin(this.walk)) * 0.08;
        if (frill) frill.scale.setScalar(lerp(frill.scale.x, 0.02, dt * 6));
        if (dist < this.cfg.range && this.attackCd <= 0) { this.state = "spit"; this.stateT = 0; }
      } else if (this.state === "spit") {
        const t = this.stateT;
        if (frill) frill.scale.setScalar(lerp(frill.scale.x, 1, dt * 9));
        this.openJaw(clamp(t * 3, 0, 0.8));
        if (t > 0.55 && !this.didHit) {
          this.didHit = true;
          this.center(tmpV);
          g.getWorldDirection(tmpV2);
          spawnVenom(tmpV.clone().addScaledVector(tmpV2, 1.2), player.clone(), this.cfg.dmg);
          Audio.screech();
        }
        if (t > 1.1) { this.didHit = false; this.state = "approach"; this.stateT = 0; this.attackCd = this.cfg.cd * rand(0.8, 1.3); }
      }
    }

    aiFlyer(dt, player, dist) {
      const g = this.group;
      this.animFly(dt);
      if (this.state === "approach") {
        // Circle a point down the road so the flock stays inside the driver's
        // field of fire, then peel off into a dive.
        this.orbitA = (this.orbitA === undefined ? rand(0, TAU) : this.orbitA) + dt * 0.55 * this.orbitDir;
        const r = 16;
        const cx = player.x + Game.forward.x * 20;
        const cz = player.z + Game.forward.z * 20;
        const tx = cx + Math.cos(this.orbitA) * r;
        const tz = cz + Math.sin(this.orbitA) * r;
        tmpV.set(tx, 9.5 + Math.sin(this.stateT) * 1.2, tz);
        g.position.lerp(tmpV, Math.min(1, dt * 1.4));
        this.faceTo(tmpV.set(cx + Math.cos(this.orbitA + 0.35) * r, 0, cz + Math.sin(this.orbitA + 0.35) * r), dt, 3);
        g.rotation.z = -this.orbitDir * 0.45;
        if (this.stateT > rand(2.6, 4.0) && this.attackCd <= 0) {
          this.state = "dive"; this.stateT = 0;
          this.diveTarget = player.clone();
          Audio.screech();
        }
      } else if (this.state === "dive") {
        this.faceTo(this.diveTarget, dt, 6);
        g.rotation.z = lerp(g.rotation.z, 0, dt * 6);
        tmpV.copy(this.diveTarget).setY(this.diveTarget.y + 0.3);
        tmpV.sub(g.position);
        const d = tmpV.length();
        tmpV.normalize().multiplyScalar(this.speed * dt * 1.5);
        g.position.add(tmpV);
        if (d < 3.2 && !this.didHit) { this.didHit = true; this.strike(this.cfg.dmg); }
        if (d < 2.0 || this.stateT > 3.2) {
          this.didHit = false;
          this.state = "approach"; this.stateT = 0;
          this.attackCd = this.cfg.cd * rand(0.9, 1.5);
        }
      }
    }

    aiCharger(dt, player, dist) {
      const g = this.group;
      if (this.state === "approach") {
        this.faceTo(player, dt, 1.6);
        this.moveToward(player, dt, this.speed * 0.35, 30);
        this.animWalk(dt, 5);
        if (this.stateT > 1.6) { this.state = "wind"; this.stateT = 0; Audio.roar(1.5); }
      } else if (this.state === "wind") {
        this.faceTo(player, dt, 2.2);
        this.animWalk(dt, 3);
        this.parts.head.rotation.x = Math.sin(this.stateT * 9) * 0.12 - 0.1;
        if (this.stateT > 0.9) { this.state = "charge"; this.stateT = 0; this.chargeDir = new THREE.Vector3(player.x - g.position.x, 0, player.z - g.position.z).normalize(); }
      } else if (this.state === "charge") {
        this.animWalk(dt, 16);
        g.position.addScaledVector(this.chargeDir, this.speed * dt);
        g.position.y = Math.abs(Math.sin(this.walk * 2)) * 0.16;
        if (dist < this.cfg.range && !this.didHit) { this.didHit = true; this.strike(this.cfg.dmg); Game.shake(0.9); }
        if (this.stateT > 2.6) { this.didHit = false; this.state = "approach"; this.stateT = 0; }
      }
    }

    aiBoss(dt, player, dist) {
      const g = this.group;
      const phase2 = this.hp < this.maxhp * 0.45;
      this.faceTo(player, dt, 1.4);
      const s = this.state;
      if (s === "approach") {
        const want = phase2 ? 11 : 15;
        this.moveToward(player, dt, this.speed * (phase2 ? 1.25 : 1), want);
        // sidestep so the fight is not static
        tmpV.set(player.z - g.position.z, 0, -(player.x - g.position.x)).normalize();
        g.position.addScaledVector(tmpV, this.orbitDir * dt * 2.6);
        this.animWalk(dt, 3.4 + (phase2 ? 1.6 : 0));
        g.position.y = Math.abs(Math.sin(this.walk)) * 0.22;
        this.openJaw(0.12 + Math.sin(this.stateT * 1.6) * 0.08);
        if (this.stateT > rand(1.4, 2.6)) {
          if (Math.random() < 0.32) { this.state = "roar"; Audio.roar(0.8); Game.shake(0.7); }
          else this.state = "bite";
          this.stateT = 0;
          this.orbitDir *= Math.random() < 0.4 ? -1 : 1;
        }
      } else if (s === "roar") {
        this.openJaw(0.9 + Math.sin(this.stateT * 22) * 0.12);
        this.parts.neck.rotation.x = -0.25 + Math.sin(this.stateT * 3) * 0.1;
        if (this.stateT > 1.5) { this.parts.neck.rotation.x = 0; this.state = "approach"; this.stateT = 0; }
      } else if (s === "bite") {
        const t = this.stateT;
        this.moveToward(player, dt, this.speed * 2.1, 7.5);
        this.animWalk(dt, 9);
        this.openJaw(clamp(t * 3.2, 0, 1.05));
        this.parts.neck.rotation.x = clamp(t * 0.7, 0, 0.45);
        if (t > 0.85 && !this.didHit) {
          this.didHit = true;
          this.openJaw(0.15);
          if (dist < this.cfg.range + 3) { this.strike(this.cfg.dmg); Game.shake(1.2); }
        }
        if (t > 1.6) {
          this.didHit = false; this.state = "approach"; this.stateT = 0;
          this.parts.neck.rotation.x = 0;
        }
      }
    }

    remove() {
      const i = enemies.indexOf(this);
      if (i >= 0) enemies.splice(i, 1);
      removeTarget(this.group);
      disposeGroup(this.group);
    }
  }

  // ---------------------------------------------------------------------------
  // Transient effects (tracers, sparks, darts, venom, muzzle flash)
  // ---------------------------------------------------------------------------
  const stuckDarts = [];
  function spawnDart(parent, worldPoint) {
    if (!worldPoint) return;
    const d = new THREE.Mesh(GEO.cyl, new THREE.MeshBasicMaterial({ color: 0x4fd7ff }));
    d.scale.set(0.06, 0.42, 0.06);
    d.userData.noHit = true;
    parent.worldToLocal(tmpV.copy(worldPoint));
    d.position.copy(tmpV.divideScalar(parent.scale.x || 1));
    d.rotation.set(rand(-1, 1), rand(-1, 1), rand(-1, 1));
    parent.add(d);
    stuckDarts.push(d);
    if (stuckDarts.length > 48) {
      const old = stuckDarts.shift();
      if (old.parent) old.parent.remove(old);
    }
  }

  function spawnTracer(from, to) {
    const geo = new THREE.BufferGeometry().setFromPoints([from.clone(), to.clone()]);
    const m = new THREE.LineBasicMaterial({ color: 0x9ff0ff, transparent: true, opacity: 0.9 });
    const line = new THREE.Line(geo, m);
    line.userData.noHit = true;
    scene.add(line);
    let t = 0;
    fx.push({
      update(dt) {
        t += dt;
        m.opacity = 0.9 * (1 - t / 0.09);
        if (t >= 0.09) { scene.remove(line); geo.dispose(); m.dispose(); return false; }
        return true;
      },
    });
  }

  function spawnSpark(point, color = 0xfff0b0, size = 0.5) {
    const m = new THREE.SpriteMaterial({ color, transparent: true, opacity: 1, depthTest: false });
    const s = new THREE.Sprite(m);
    s.position.copy(point);
    s.scale.setScalar(size);
    s.userData.noHit = true;
    scene.add(s);
    let t = 0;
    fx.push({
      update(dt) {
        t += dt;
        s.scale.setScalar(size * (1 + t * 8));
        m.opacity = Math.max(0, 1 - t / 0.22);
        if (t > 0.22) { scene.remove(s); m.dispose(); return false; }
        return true;
      },
    });
  }

  function spawnVenom(from, to, dmg) {
    const m = new THREE.Mesh(GEO.sphere, new THREE.MeshBasicMaterial({ color: 0x8dff5a }));
    m.scale.setScalar(0.5);
    m.position.copy(from);
    scene.add(m);
    const v = {
      mesh: m, dmg,
      dir: to.clone().sub(from).normalize(),
      life: 3.2,
      dead: false,
      remove() {
        this.dead = true;
        removeTarget(m);
        scene.remove(m);
        const i = venom.indexOf(this);
        if (i >= 0) venom.splice(i, 1);
      },
    };
    m.userData.venomRef = v;
    addTarget(m);
    venom.push(v);
  }

  // ---------------------------------------------------------------------------
  // Pickups — DNA canisters, dart crates, repair kits, stranded rangers
  // ---------------------------------------------------------------------------
  const PICKUPS = {
    dna:    { color: 0xffc23c, label: "DNA SAMPLE", score: 600 },
    ammo:   { color: 0x4fd7ff, label: "DART CRATE", score: 100 },
    med:    { color: 0x4ce08a, label: "REPAIR KIT", score: 100 },
    rescue: { color: 0xff7ad9, label: "SURVIVOR", score: 1200 },
  };

  function buildPickup(kind) {
    const g = new THREE.Group();
    const cfg = PICKUPS[kind];
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ color: cfg.color, transparent: true, opacity: 0.35, depthWrite: false }));
    glow.scale.setScalar(3.2);
    glow.userData.noHit = true;
    glow.position.y = 1.4;
    g.add(glow);

    if (kind === "dna") {
      const tube = cyl(0.28, 1.2, new THREE.MeshLambertMaterial({ color: 0xffc23c, emissive: 0x6b4a00 }), 0, 1.4, 0);
      g.add(tube);
      g.add(cyl(0.34, 0.16, mat(0x2b2b2b), 0, 2.05, 0));
      g.add(cyl(0.34, 0.16, mat(0x2b2b2b), 0, 0.78, 0));
      // double helix
      const hm = mat(0xffffff);
      for (let i = 0; i < 10; i++) {
        const a = i * 0.62, y = 0.95 + i * 0.095;
        g.add(ball(0.055, hm, Math.cos(a) * 0.15, y, Math.sin(a) * 0.15));
        g.add(ball(0.055, hm, -Math.cos(a) * 0.15, y, -Math.sin(a) * 0.15));
      }
    } else if (kind === "rescue") {
      // A stranded ranger. Only the beacon above them is a valid target.
      const skin = mat(0xd2a679), cloth = mat(0x3c6b4a);
      const p = new THREE.Group();
      p.position.y = 0;
      p.add(box(0.46, 0.72, 0.28, cloth, 0, 1.28, 0));
      p.add(ball(0.19, skin, 0, 1.78, 0));
      p.add(box(0.5, 0.12, 0.34, mat(0xe0c15a), 0, 1.92, 0));
      [-1, 1].forEach((s) => {
        p.add(box(0.16, 0.6, 0.16, cloth, s * 0.3, 1.02, 0));
        p.add(box(0.17, 0.7, 0.17, mat(0x2f3a46), s * 0.13, 0.55, 0));
      });
      p.traverse((o) => (o.userData.noHit = true));
      g.add(p);
      const beacon = ball(0.3, new THREE.MeshBasicMaterial({ color: 0xff7ad9 }), 0, 2.6, 0);
      g.add(beacon);
      g.userData.wave = p.children[3];
    } else {
      const wood = mat(kind === "ammo" ? 0x35566b : 0x3d6b4a);
      g.add(box(1.1, 0.9, 1.1, wood, 0, 0.75, 0));
      const badge = mat(cfg.color);
      g.add(box(0.7, 0.14, 1.14, badge, 0, 0.95, 0));
      g.add(box(0.14, 0.7, 1.14, badge, 0, 0.95, 0));
      g.add(box(1.14, 0.16, 0.16, mat(0x1d2b22), 0, 0.32, 0));
    }
    return g;
  }

  function addPickup(kind, pos) {
    const g = buildPickup(kind);
    g.position.copy(pos);
    g.rotation.y = rand(0, TAU);
    worldGroup.add(g);
    const p = { kind, group: g, taken: false, t: rand(0, TAU) };
    g.userData.pickupRef = p;
    pickups.push(p);
    addTarget(g);
    return p;
  }

  function collectPickup(p, point) {
    if (p.taken) return;
    p.taken = true;
    removeTarget(p.group);
    const cfg = PICKUPS[p.kind];
    spawnSpark(point || p.group.position, cfg.color, 1.4);
    Game.addScore(cfg.score, point);
    if (p.kind === "ammo") { Game.weapon.reserve += 24; Game.reload(true); Audio.pickup(); Game.showBanner("", "DART CRATE +24", 0.9); }
    else if (p.kind === "med") { Game.heal(28); Audio.pickup(); Game.showBanner("", "VEHICLE REPAIRED", 0.9); }
    else if (p.kind === "dna") { Game.dna++; Audio.pickup(); }
    else if (p.kind === "rescue") { Game.rescued++; Audio.rescue(); Game.showBanner("", "SURVIVOR AIRLIFTED", 1.1); }
    Game.syncHud();
    // pop the object away
    let t = 0;
    const g = p.group;
    fx.push({
      update(dt) {
        t += dt;
        g.position.y += dt * 6;
        g.rotation.y += dt * 9;
        g.scale.multiplyScalar(Math.max(0.01, 1 - dt * 3.4));
        if (t > 0.6) { disposeGroup(g); const i = pickups.indexOf(p); if (i >= 0) pickups.splice(i, 1); return false; }
        return true;
      },
    });
  }

  // ---------------------------------------------------------------------------
  // Zones — four sectors of the park, each with its own palette and wave script
  // ---------------------------------------------------------------------------
  const ZONES = [
    {
      name: "SECTOR 01 · GALLIMIMUS VALLEY",
      sky: [0x1d3b52, 0xe9915a], fog: 0xe9915a, fogNear: 12, fogFar: 260,
      ambient: 0.5, sunColor: 0xffd2a0, sunInt: 0.9, sunPos: [-60, 40, 60],
      ground: 0x46522f, grass: 0x5b6a3a, tree: 0x2f4a2c, trunk: 0x4a3a2a,
      beats: [
        { u: 0.10, wave: [["compy", 4]], msg: "MOVEMENT IN THE FERNS" },
        { u: 0.28, wave: [["raptor", 2]], msg: "RAPTORS INBOUND" },
        { u: 0.48, wave: [["compy", 4], ["raptor", 2]] },
        { u: 0.68, wave: [["dilo", 2], ["raptor", 1]], msg: "DILOPHOSAURUS — WATCH THE SPIT" },
        { u: 0.88, wave: [["raptor", 4]], msg: "PACK ATTACK" },
      ],
    },
    {
      name: "SECTOR 02 · AVIARY RIDGE",
      sky: [0x0a1420, 0x263449], fog: 0x263449, fogNear: 10, fogFar: 200,
      ambient: 0.34, sunColor: 0x9fc4ff, sunInt: 0.5, sunPos: [40, 60, -30], storm: true,
      ground: 0x2e3a2c, grass: 0x3a4733, tree: 0x22331f, trunk: 0x3a2f24,
      beats: [
        { u: 0.12, wave: [["ptero", 2]], msg: "AVIARY BREACH — LOOK UP" },
        { u: 0.30, wave: [["ptero", 2], ["dilo", 2]] },
        { u: 0.52, wave: [["raptor", 3], ["ptero", 1]] },
        { u: 0.72, wave: [["ptero", 4]], msg: "FLOCK DIVING" },
        { u: 0.90, wave: [["dilo", 3], ["raptor", 2]] },
      ],
    },
    {
      name: "SECTOR 03 · HERBIVORE PLAINS",
      sky: [0x2f4368, 0xd9a468], fog: 0xd9a468, fogNear: 16, fogFar: 250,
      ambient: 0.46, sunColor: 0xffdcae, sunInt: 0.9, sunPos: [70, 45, 40],
      ground: 0x5b5c36, grass: 0x75713e, tree: 0x35492a, trunk: 0x4a3a27,
      beats: [
        { u: 0.14, wave: [["raptor", 3]] },
        { u: 0.34, wave: [["trike", 1]], msg: "STAMPEDE — AIM FOR THE HEAD" },
        { u: 0.55, wave: [["dilo", 2], ["compy", 6]] },
        { u: 0.74, wave: [["trike", 1], ["raptor", 2]] },
        { u: 0.92, wave: [["raptorAlpha", 1], ["raptor", 3]], msg: "ALPHA IN THE OPEN" },
      ],
    },
    {
      name: "SECTOR 04 · PADDOCK NINE",
      sky: [0x05080e, 0x14202c], fog: 0x14202c, fogNear: 10, fogFar: 185,
      ambient: 0.3, sunColor: 0xb6cfe8, sunInt: 0.55, sunPos: [-30, 55, -50], storm: true,
      ground: 0x2a2f26, grass: 0x343a2c, tree: 0x1d2a1c, trunk: 0x2f271e,
      beats: [
        { u: 0.16, wave: [["raptor", 3], ["dilo", 1]] },
        { u: 0.40, wave: [["ptero", 2], ["raptorAlpha", 1]] },
        { u: 0.64, wave: [["compy", 8], ["raptor", 2]] },
        { u: 0.86, wave: [["rex", 1]], msg: "PADDOCK NINE CONTAINMENT FAILURE", boss: true },
      ],
    },
  ];

  // ---------------------------------------------------------------------------
  // World construction
  // ---------------------------------------------------------------------------
  let path = null;
  let pathLength = 0;
  let weather = null;

  function buildPath() {
    const pts = [new THREE.Vector3(0, 0, 20), new THREE.Vector3(0, 0, -30)];
    let x = 0;
    for (let i = 2; i < 18; i++) {
      x += rand(-26, 26);
      x = clamp(x, -70, 70);
      pts.push(new THREE.Vector3(x, 0, -30 - (i - 1) * 62));
    }
    return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.35);
  }

  function skyDome(topHex, botHex) {
    const geo = new THREE.SphereGeometry(600, 24, 16);
    const m = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: { top: { value: new THREE.Color(topHex) }, bot: { value: new THREE.Color(botHex) } },
      vertexShader: "varying float h; void main(){ h = normalize(position).y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "uniform vec3 top; uniform vec3 bot; varying float h; void main(){ gl_FragColor = vec4(mix(bot, top, clamp(h*1.6,0.0,1.0)), 1.0); }",
    });
    const mesh = new THREE.Mesh(geo, m);
    mesh.userData.noHit = true;
    return mesh;
  }

  function buildTree(z, tall) {
    const g = new THREE.Group();
    const h = tall ? rand(9, 16) : rand(4, 8);
    const trunkM = mat(z.trunk);
    const leafM = mat(new THREE.Color(z.tree).offsetHSL(rand(-0.03, 0.03), 0, rand(-0.07, 0.07)).getHex());
    g.add(cyl(rand(0.28, 0.5), h, trunkM, 0, h / 2, 0));
    if (tall && Math.random() < 0.35) {
      // palm-ish crown
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * TAU;
        const frond = box(0.5, 0.12, 4.4, leafM, Math.cos(a) * 1.9, h, Math.sin(a) * 1.9);
        frond.rotation.y = -a;
        frond.rotation.x = rand(0.18, 0.42);
        g.add(frond);
      }
      g.add(ball(0.7, leafM, 0, h, 0));
    } else {
      const layers = 2;
      for (let i = 0; i < layers; i++) {
        const r = (tall ? 3.4 : 2.1) * (1 - i * 0.22);
        g.add(cone(r, h * 0.42, leafM, 0, h * (0.62 + i * 0.2), 0));
      }
    }
    g.traverse((o) => (o.userData.noHit = true));
    return g;
  }

  function buildFencePost(h = 5) {
    const g = new THREE.Group();
    g.add(cyl(0.14, h, mat(0x4b4741), 0, h / 2, 0));
    g.add(box(0.9, 0.2, 0.2, mat(0x3a3733), 0, h - 0.4, 0));
    const lamp = ball(0.16, new THREE.MeshBasicMaterial({ color: 0xffc23c }), 0, h + 0.1, 0);
    g.add(lamp);
    g.traverse((o) => (o.userData.noHit = true));
    return g;
  }

  function buildSign(text) {
    const cv = document.createElement("canvas");
    cv.width = 512; cv.height = 256;
    const c = cv.getContext("2d");
    c.fillStyle = "#f0b429"; c.fillRect(0, 0, 512, 256);
    c.fillStyle = "#1a1a14"; c.fillRect(12, 12, 488, 232);
    c.fillStyle = "#f0b429";
    c.font = "bold 54px monospace"; c.textAlign = "center";
    c.fillText("⚠ DANGER", 256, 96);
    c.font = "bold 34px monospace";
    c.fillText(text, 256, 168);
    const tex = new THREE.CanvasTexture(cv);
    const g = new THREE.Group();
    const board = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.6), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }));
    board.position.y = 3.1;
    g.add(board);
    g.add(cyl(0.1, 3.2, mat(0x4a4640), 0, 1.6, 0));
    g.traverse((o) => (o.userData.noHit = true));
    return g;
  }

  function buildGate(zoneName) {
    const g = new THREE.Group();
    const stone = mat(0x6b5a45);
    [-1, 1].forEach((s) => {
      g.add(box(2.4, 11, 2.4, stone, s * 7.5, 5.5, 0));
      g.add(box(3, 1, 3, mat(0x4c4034), s * 7.5, 11.3, 0));
      const torch = ball(0.4, new THREE.MeshBasicMaterial({ color: 0xff9a3c }), s * 7.5, 12.1, 0);
      g.add(torch);
    });
    g.add(box(18.5, 1.6, 1.4, mat(0x4c4034), 0, 12.4, 0));
    const cv = document.createElement("canvas");
    cv.width = 1024; cv.height = 128;
    const c = cv.getContext("2d");
    c.fillStyle = "rgba(0,0,0,0)"; c.fillRect(0, 0, 1024, 128);
    c.fillStyle = "#ffc23c"; c.font = "bold 70px monospace"; c.textAlign = "center";
    c.fillText(zoneName, 512, 88);
    const tex = new THREE.CanvasTexture(cv);
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(17, 2.1), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide }));
    banner.position.set(0, 10.4, 0);
    g.add(banner);
    g.traverse((o) => (o.userData.noHit = true));
    return g;
  }

  function buildWeather(z) {
    const grp = new THREE.Group();
    grp.userData.noHit = true;
    // drifting motes / mist
    const n = 260;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = rand(-60, 60);
      pos[i * 3 + 1] = rand(0.5, 22);
      pos[i * 3 + 2] = rand(-60, 60);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({
      color: z.storm ? 0xaecbe8 : 0xffe9b8, size: z.storm ? 0.16 : 0.13,
      transparent: true, opacity: z.storm ? 0.75 : 0.5, depthWrite: false,
    }));
    grp.add(pts);
    scene.add(grp);
    return { group: grp, pts, geo, storm: !!z.storm, flash: 0, nextFlash: rand(3, 9) };
  }

  function clearWorld() {
    while (worldGroup.children.length) disposeGroup(worldGroup.children[0]);
    enemies.length = 0;
    pickups.length = 0;
    venom.forEach((v) => { scene.remove(v.mesh); });
    venom.length = 0;
    stuckDarts.length = 0;
    hitTargets = [];
    if (weather) { scene.remove(weather.group); weather = null; }
    if (hemi) scene.remove(hemi);
    if (sun) scene.remove(sun);
    if (fillLight) scene.remove(fillLight);
    if (lightningLight) scene.remove(lightningLight);
  }

  function buildZone(index) {
    clearWorld();
    const z = ZONES[index];
    path = buildPath();
    pathLength = path.getLength();

    scene.fog = new THREE.Fog(z.fog, z.fogNear, z.fogFar);
    renderer.setClearColor(z.fog);
    worldGroup.add(skyDome(z.sky[0], z.sky[1]));

    hemi = new THREE.HemisphereLight(z.sky[1], z.ground, z.ambient);
    scene.add(hemi);
    sun = new THREE.DirectionalLight(z.sunColor, z.sunInt);
    sun.position.set(...z.sunPos);
    scene.add(sun);
    fillLight = new THREE.PointLight(0xffc23c, 0.85, 34, 2); // jeep headlights glow
    scene.add(fillLight);
    lightningLight = new THREE.DirectionalLight(0xdff0ff, 0);
    lightningLight.position.set(0, 80, -40);
    scene.add(lightningLight);

    // ---- terrain -----------------------------------------------------------
    const gGeo = new THREE.PlaneGeometry(1400, 1400, 48, 48);
    gGeo.rotateX(-Math.PI / 2);
    const gp = gGeo.attributes.position;
    const colors = new Float32Array(gp.count * 3);
    const cBase = new THREE.Color(z.ground), cGrass = new THREE.Color(z.grass), tmpC = new THREE.Color();
    for (let i = 0; i < gp.count; i++) {
      const x = gp.getX(i), zz = gp.getZ(i);
      gp.setY(i, noise2(x * 0.6, zz * 0.6) * 1.5 + noise2(x * 2.4, zz * 2.1) * 0.35);
      tmpC.copy(cBase).lerp(cGrass, (noise2(x * 1.7, zz * 1.9) + 1) * 0.5);
      colors[i * 3] = tmpC.r; colors[i * 3 + 1] = tmpC.g; colors[i * 3 + 2] = tmpC.b;
    }
    gGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    gGeo.computeVertexNormals();
    const ground = new THREE.Mesh(gGeo, new THREE.MeshLambertMaterial({ vertexColors: true }));
    ground.position.set(0, -0.4, -560);
    ground.userData.noHit = true;
    worldGroup.add(ground);

    // ---- road ribbon -------------------------------------------------------
    const SAMPLES = 240, HALF = 4.2;
    const rp = new Float32Array(SAMPLES * 2 * 3);
    const idx = [];
    const up = new THREE.Vector3(0, 1, 0);
    for (let i = 0; i < SAMPLES; i++) {
      const u = i / (SAMPLES - 1);
      const p = path.getPointAt(u);
      const t = path.getTangentAt(u);
      tmpV.copy(t).cross(up).normalize().multiplyScalar(HALF);
      rp[i * 6] = p.x - tmpV.x; rp[i * 6 + 1] = 0.12; rp[i * 6 + 2] = p.z - tmpV.z;
      rp[i * 6 + 3] = p.x + tmpV.x; rp[i * 6 + 4] = 0.12; rp[i * 6 + 5] = p.z + tmpV.z;
      if (i < SAMPLES - 1) {
        const a = i * 2;
        idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    const roadGeo = new THREE.BufferGeometry();
    roadGeo.setAttribute("position", new THREE.BufferAttribute(rp, 3));
    roadGeo.setIndex(idx);
    roadGeo.computeVertexNormals();
    const road = new THREE.Mesh(roadGeo, new THREE.MeshLambertMaterial({ color: 0x5a4b39 }));
    road.userData.noHit = true;
    worldGroup.add(road);

    // ---- scatter props along the route -------------------------------------
    const right = new THREE.Vector3();
    for (let i = 0; i < 170; i++) {
      const u = Math.random();
      const p = path.getPointAt(u);
      const t = path.getTangentAt(u);
      right.copy(t).cross(up).normalize();
      const side = Math.random() < 0.5 ? -1 : 1;
      const off = rand(7, 62);
      tmpV.copy(p).addScaledVector(right, side * off);
      const roll = Math.random();
      let obj;
      if (roll < 0.62) obj = buildTree(z, off > 16 || Math.random() < 0.3);
      else if (roll < 0.78) {
        obj = new THREE.Mesh(GEO.rock, mat(0x6d6a61));
        obj.scale.set(rand(0.7, 2.6), rand(0.6, 2), rand(0.7, 2.6));
        obj.rotation.set(rand(0, 3), rand(0, 3), rand(0, 3));
        obj.userData.noHit = true;
      } else if (roll < 0.94) {
        obj = new THREE.Group();
        const fm = mat(z.tree);
        for (let f = 0; f < 3; f++) {
          const fr = cone(rand(0.5, 0.9), rand(1.2, 2.2), fm, rand(-1, 1), rand(0.6, 1.1), rand(-1, 1));
          fr.rotation.z = rand(-0.3, 0.3);
          obj.add(fr);
        }
        obj.traverse((o) => (o.userData.noHit = true));
      } else {
        obj = buildFencePost(rand(4, 6.5));
      }
      obj.position.set(tmpV.x, 0, tmpV.z);
      obj.rotation.y += rand(0, TAU);
      worldGroup.add(obj);
    }

    // perimeter fence posts hugging the road
    for (let i = 0; i < 46; i++) {
      const u = i / 46;
      const p = path.getPointAt(u);
      const t = path.getTangentAt(u);
      right.copy(t).cross(up).normalize();
      [-1, 1].forEach((s) => {
        const post = buildFencePost(5);
        post.position.copy(p).addScaledVector(right, s * 6.4);
        post.position.y = 0;
        worldGroup.add(post);
      });
    }

    // gate at the start, warning signs along the way
    const gate = buildGate("ISLA NOVA");
    const gp0 = path.getPointAt(0.02);
    gate.position.set(gp0.x, 0, gp0.z);
    gate.lookAt(path.getPointAt(0.06).x, 0, path.getPointAt(0.06).z);
    worldGroup.add(gate);
    ["RESTRICTED", "PADDOCK AHEAD", "DO NOT EXIT VEHICLE", "HIGH VOLTAGE"].forEach((txt, i) => {
      const s = buildSign(txt);
      const u = 0.15 + i * 0.2;
      const p = path.getPointAt(u);
      const t = path.getTangentAt(u);
      right.copy(t).cross(up).normalize();
      s.position.copy(p).addScaledVector(right, (i % 2 ? 1 : -1) * 7.6);
      s.position.y = 0;
      s.lookAt(p.x, 3.1, p.z);
      worldGroup.add(s);
    });

    // ---- pickups -----------------------------------------------------------
    const plan = [
      ["ammo", 0.07], ["dna", 0.16], ["rescue", 0.22], ["med", 0.33],
      ["dna", 0.41], ["ammo", 0.46], ["dna", 0.57], ["rescue", 0.61],
      ["med", 0.70], ["ammo", 0.77], ["dna", 0.83], ["med", 0.845], ["ammo", 0.85], ["rescue", 0.94],
    ];
    plan.forEach(([kind, u]) => {
      const p = path.getPointAt(clamp(u + rand(-0.02, 0.02), 0.03, 0.97));
      const t = path.getTangentAt(u);
      right.copy(t).cross(up).normalize();
      tmpV.copy(p).addScaledVector(right, (Math.random() < 0.5 ? -1 : 1) * rand(5.5, 9.5));
      tmpV.y = 0;
      addPickup(kind, tmpV);
    });

    weather = buildWeather(z);
    return z;
  }

  // ---------------------------------------------------------------------------
  // The jeep interior + tranquilizer rifle, both parented to the camera
  // ---------------------------------------------------------------------------
  const cockpit = new THREE.Group();
  camera.add(cockpit);

  function buildCockpit() {
    const bodyM = mat(0xc9a227);
    const darkM = mat(0x2a2c28);
    const g = cockpit;

    // hood stretching out in front of the camera
    const hood = box(2.9, 0.12, 1.9, bodyM, 0, -1.42, -2.5);
    hood.rotation.x = -0.05;
    g.add(hood);
    g.add(box(3.0, 0.34, 0.14, bodyM, 0, -1.3, -3.42));           // front lip
    g.add(box(0.34, 0.16, 1.8, mat(0x9c7d18), -0.85, -1.35, -2.5)); // racing stripes
    g.add(box(0.34, 0.16, 1.8, mat(0x9c7d18), 0.85, -1.35, -2.5));
    g.add(box(0.9, 0.1, 0.9, mat(0x8f7016), 0, -1.34, -2.2));       // hood scoop
    // headlights peeking over the front edge
    [-1, 1].forEach((s) => {
      const hl = cyl(0.085, 0.08, new THREE.MeshBasicMaterial({ color: 0xfff0c0 }), s * 1.18, -1.26, -3.45);
      hl.rotation.x = Math.PI / 2;
      g.add(hl);
    });
    // dashboard
    g.add(box(2.8, 0.5, 0.45, darkM, 0, -1.5, -1.35));
    const glow = new THREE.MeshBasicMaterial({ color: 0x4ce08a });
    for (let i = 0; i < 5; i++) g.add(box(0.14, 0.05, 0.02, glow, -0.8 + i * 0.25, -1.34, -1.13));
    g.add(cyl(0.2, 0.04, darkM, 0.7, -1.32, -1.16));
    // A-pillars + roll cage
    [-1, 1].forEach((s) => {
      const pil = box(0.1, 2.9, 0.1, darkM, s * 1.72, -0.2, -1.5);
      pil.rotation.x = 0.16;
      g.add(pil);
      g.add(box(0.09, 0.09, 2.6, darkM, s * 1.72, 1.16, -0.35));
    });
    g.add(box(3.5, 0.1, 0.1, darkM, 0, 1.2, -1.64));
    // mirror
    const mir = box(0.4, 0.14, 0.05, darkM, -1.45, 0.1, -1.45);
    g.add(mir);
    // windscreen frame tint
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(3.3, 1.6), new THREE.MeshBasicMaterial({
      color: 0x9fd6ff, transparent: true, opacity: 0.05, depthWrite: false,
    }));
    glass.position.set(0, -0.15, -1.6);
    glass.rotation.x = 0.16;
    g.add(glass);

    g.traverse((o) => (o.userData.noHit = true));
  }

  const rifle = new THREE.Group();
  camera.add(rifle);
  const muzzleFlash = new THREE.PointLight(0x9ff0ff, 0, 12, 2);

  function buildRifle() {
    const metal = mat(0x3c4147);
    const poly = mat(0x23282c);
    const accent = mat(0x4fd7ff);
    rifle.add(box(0.16, 0.2, 0.9, poly, 0, 0, -0.1));          // receiver
    rifle.add(cyl(0.045, 0.95, metal, 0, 0.04, -0.85));         // barrel
    const barrel = rifle.children[1];
    barrel.rotation.x = Math.PI / 2;
    rifle.add(box(0.1, 0.1, 0.2, metal, 0, 0.12, -1.28));       // muzzle brake
    rifle.add(box(0.11, 0.28, 0.34, poly, 0, -0.2, 0.12));      // grip
    const grip = rifle.children[3];
    grip.rotation.x = 0.3;
    rifle.add(box(0.14, 0.22, 0.5, poly, 0, -0.05, 0.5));       // stock
    // scope
    const scope = cyl(0.05, 0.42, metal, 0, 0.2, -0.18);
    scope.rotation.x = Math.PI / 2;
    rifle.add(scope);
    rifle.add(box(0.05, 0.11, 0.05, metal, 0, 0.13, -0.32));
    rifle.add(box(0.05, 0.11, 0.05, metal, 0, 0.13, -0.04));
    // dart magazine with glowing tips
    rifle.add(box(0.12, 0.3, 0.18, accent, 0, -0.2, -0.34));
    rifle.traverse((o) => (o.userData.noHit = true));

    rifle.scale.setScalar(0.62);
    rifle.position.set(0.5, -0.44, -0.85);
    rifle.rotation.set(0.05, 0.07, 0.03);
    muzzleFlash.position.set(0, 0.12, -1.4);
    rifle.add(muzzleFlash);
  }

  buildCockpit();
  buildRifle();

  const MUZZLE_LOCAL = new THREE.Vector3(0, 0.12, -1.42);

  // ---------------------------------------------------------------------------
  // Input
  // ---------------------------------------------------------------------------
  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2, ndc: new THREE.Vector2(0, 0) };
  const keys = {};
  let firing = false;
  const raycaster = new THREE.Raycaster();
  const isTouch = matchMedia("(pointer: coarse)").matches;
  if (isTouch) document.body.classList.add("touch");

  function setPointer(cx, cy) {
    pointer.x = cx; pointer.y = cy;
    pointer.ndc.x = (cx / window.innerWidth) * 2 - 1;
    pointer.ndc.y = -(cy / window.innerHeight) * 2 + 1;
    const r = $("reticle");
    r.style.left = cx + "px";
    r.style.top = cy + "px";
  }
  setPointer(pointer.x, pointer.y);

  window.addEventListener("mousemove", (e) => setPointer(e.clientX, e.clientY));
  window.addEventListener("mousedown", (e) => {
    if (e.button === 0 && Game.state === "playing") { firing = true; Game.fire(); }
    if (e.button === 2 && Game.state === "playing") Game.reload();
  });
  window.addEventListener("mouseup", () => (firing = false));
  window.addEventListener("contextmenu", (e) => e.preventDefault());

  window.addEventListener("touchstart", (e) => {
    if (Game.state !== "playing") return;
    const t = e.changedTouches[0];
    if (t.target && t.target.id === "mobilefire") return;
    setPointer(t.clientX, t.clientY);
    firing = true;
    Game.fire();
  }, { passive: true });
  window.addEventListener("touchmove", (e) => {
    const t = e.changedTouches[0];
    if (t.target && t.target.id === "mobilefire") return;
    setPointer(t.clientX, t.clientY);
  }, { passive: true });
  window.addEventListener("touchend", () => (firing = false), { passive: true });
  $("mobilefire").addEventListener("touchstart", (e) => { e.preventDefault(); firing = true; Game.fire(); });
  $("mobilefire").addEventListener("touchend", (e) => { e.preventDefault(); firing = false; });

  window.addEventListener("keydown", (e) => {
    keys[e.code] = true;
    if (e.code === "Space") { e.preventDefault(); if (Game.state === "playing") { firing = true; Game.fire(); } }
    if (e.code === "KeyR" && Game.state === "playing") Game.reload();
    if (e.code === "KeyP" || e.code === "Escape") Game.togglePause();
    if (e.code === "KeyM") Game.showBanner("", Audio.toggleMute() ? "AUDIO MUTED" : "AUDIO ON", 0.8);
  });
  window.addEventListener("keyup", (e) => {
    keys[e.code] = false;
    if (e.code === "Space") firing = false;
  });

  // ---------------------------------------------------------------------------
  // Game controller
  // ---------------------------------------------------------------------------
  const Game = {
    state: "title",
    zoneIndex: 0,
    zone: null,
    railU: 0,
    railSpeed: 17,
    beatIndex: 0,
    inEncounter: false,
    encounterT: 0,
    pending: [],           // staggered spawn queue
    playerPos: new THREE.Vector3(),
    forward: new THREE.Vector3(0, 0, -1),
    health: 100,
    score: 0,
    combo: 0,
    comboT: 0,
    dna: 0,
    rescued: 0,
    kills: 0,
    shots: 0,
    hits: 0,
    shakeAmt: 0,
    bannerT: 0,
    zoneClearT: 0,
    weapon: { mag: 8, magSize: 8, reserve: 72, reloading: false, reloadT: 0, cd: 0, recoil: 0 },

    get mult() { return Math.min(4, 1 + Math.floor(this.combo / 5) * 0.5); },

    /* ------------------------------- lifecycle ---------------------------- */
    start() {
      Audio.init(); Audio.resume();
      this.state = "playing";
      this.zoneIndex = 0;
      this.health = 100; this.score = 0; this.combo = 0; this.dna = 0;
      this.rescued = 0; this.kills = 0; this.shots = 0; this.hits = 0;
      this.weapon.mag = this.weapon.magSize;
      this.weapon.reserve = 72;
      this.weapon.reloading = false;
      $("titlescreen").classList.add("hidden");
      $("endscreen").classList.add("hidden");
      $("hud").classList.remove("hidden");
      if (!isTouch) $("reticle").classList.remove("hidden");
      this.startZone(0);
    },

    startZone(i) {
      this.zoneIndex = i;
      this.zone = buildZone(i);
      this.railU = 0;
      this.beatIndex = 0;
      this.inEncounter = false;
      this.pending.length = 0;
      this.zoneClearT = 0;
      $("zonename").textContent = this.zone.name;
      this.setObjective("DRIVE ON");
      this.showBanner(this.zone.name.split("·")[0].trim(), this.zone.name.split("·")[1].trim(), 2.4);
      Audio.stage();
      this.syncHud();
    },

    end(win) {
      this.state = "over";
      firing = false;
      $("reticle").classList.add("hidden");
      const acc = this.shots ? Math.round((this.hits / this.shots) * 100) : 0;
      const bonus = win ? Math.round(this.health * 50 + this.rescued * 1500 + this.dna * 800) : 0;
      this.score += bonus;
      $("endtitle").textContent = win ? "PARK SECURED" : "CONTAINMENT LOST";
      $("endsub").textContent = win
        ? "ALL FOUR SECTORS SEDATED — EXTRACTION COMPLETE"
        : "THE JEEP DID NOT MAKE IT TO THE PADDOCK";
      $("endstats").innerHTML =
        `FINAL SCORE <b>${this.score.toLocaleString()}</b><br>` +
        `SECTOR REACHED <b>${this.zoneIndex + 1} / ${ZONES.length}</b><br>` +
        `ANIMALS SEDATED <b>${this.kills}</b><br>` +
        `SURVIVORS AIRLIFTED <b>${this.rescued}</b><br>` +
        `DNA SAMPLES <b>${this.dna}</b><br>` +
        `ACCURACY <b>${acc}%</b>` +
        (win ? `<br>CLEAR BONUS <b>+${bonus.toLocaleString()}</b>` : "");
      $("endscreen").classList.remove("hidden");
      if (win) Audio.stage(); else Audio.gameover();
    },

    togglePause() {
      if (this.state === "playing") {
        this.state = "paused";
        firing = false;
        $("pausescreen").classList.remove("hidden");
        $("reticle").classList.add("hidden");
      } else if (this.state === "paused") {
        this.state = "playing";
        $("pausescreen").classList.add("hidden");
        if (!isTouch) $("reticle").classList.remove("hidden");
      }
    },

    /* -------------------------------- combat ------------------------------ */
    fire() {
      const w = this.weapon;
      if (this.state !== "playing" || w.reloading || w.cd > 0) return;
      if (w.mag <= 0) { Audio.dryFire(); this.reload(); return; }

      w.mag--;
      w.cd = 0.13;
      w.recoil = 1;
      this.shots++;
      muzzleFlash.intensity = 3.2;
      Audio.shot();

      const muzzle = rifle.localToWorld(MUZZLE_LOCAL.clone());
      raycaster.setFromCamera(pointer.ndc, camera);
      const hits = raycaster.intersectObjects(hitTargets, true);
      let struck = null;
      for (const h of hits) {
        if (h.object.userData.noHit) continue;
        struck = h;
        break;
      }

      if (!struck) {
        // Light-gun forgiveness: a shot that passes close to an animal still
        // counts as a body hit, the way an arcade cabinet would score it.
        const assist = this.assistTarget();
        if (assist) {
          spawnTracer(muzzle, assist.point);
          spawnSpark(assist.point, 0xffe08a, 0.5);
          assist.dino.damage(24, false, assist.point);
          this.hits++;
          this.combo++;
          this.comboT = 2.6;
          Audio.hit();
          this.syncHud();
          return;
        }
        spawnTracer(muzzle, raycaster.ray.at(180, new THREE.Vector3()));
        this.combo = 0;
        this.syncHud();
        return;
      }

      spawnTracer(muzzle, struck.point);

      // resolve what was hit by walking up the hierarchy
      let obj = struck.object, dino = null, pickup = null;
      const venomRef = obj.userData.venomRef;
      while (obj) {
        if (obj.userData.dinoRef) { dino = obj.userData.dinoRef; break; }
        if (obj.userData.pickupRef) { pickup = obj.userData.pickupRef; break; }
        obj = obj.parent;
      }

      if (venomRef) {
        venomRef.remove();
        spawnSpark(struck.point, 0x8dff5a, 0.9);
        this.addScore(120, struck.point);
        this.hits++;
        Audio.hit();
        return;
      }
      if (pickup) { this.hits++; collectPickup(pickup, struck.point); return; }
      if (!dino || dino.dead) { this.combo = 0; return; }

      this.hits++;
      const isMouth = !!struck.object.userData.mouth;
      const isCrit = isMouth || !!struck.object.userData.crit;
      const base = 24;
      const dmg = base * (isMouth ? 4 : isCrit ? 2.6 : 1);
      dino.damage(dmg, isCrit, struck.point);
      spawnSpark(struck.point, isCrit ? 0x4fd7ff : 0xffe08a, isCrit ? 0.8 : 0.5);
      this.combo++;
      this.comboT = 2.6;
      if (isCrit) Audio.crit(); else Audio.hit();
      this.syncHud();
    },

    // Nearest animal whose body sits within a small radius of the crosshair.
    assistTarget() {
      const px = (pointer.ndc.x * 0.5 + 0.5) * window.innerWidth;
      const py = (-pointer.ndc.y * 0.5 + 0.5) * window.innerHeight;
      const radius = Math.min(window.innerWidth, window.innerHeight) * 0.07;
      let best = null, bestD = radius;
      for (const e of enemies) {
        if (e.dead) continue;
        const c = e.center(new THREE.Vector3());
        const d3 = c.distanceTo(cameraRig.position);
        if (d3 > 95) continue;
        const r = radius * (e.cfg.assist || 1);
        const v = c.clone().project(camera);
        if (v.z > 1) continue;
        const sx = (v.x * 0.5 + 0.5) * window.innerWidth;
        const sy = (-v.y * 0.5 + 0.5) * window.innerHeight;
        const d = Math.hypot(sx - px, sy - py);
        if (d < Math.min(r, bestD)) { bestD = d; best = { dino: e, point: c }; }
      }
      return best;
    },

    reload(instant) {
      const w = this.weapon;
      if (w.reloading || w.mag >= w.magSize) { if (instant) w.mag = w.magSize; return; }
      w.reloading = true;
      w.reloadT = instant ? 0.15 : 1.15;
      if (!instant) Audio.reload();
      $("reloadmsg").textContent = "RELOADING";
    },

    damagePlayer(amount, source) {
      if (this.state !== "playing") return;
      this.health -= amount;
      this.combo = 0;
      this.shake(0.7);
      Audio.hurt();
      $("vignette").style.opacity = "1";
      setTimeout(() => ($("vignette").style.opacity = String(clamp(1 - this.health / 60, 0, 0.7))), 220);
      this.floaterScreen(window.innerWidth / 2, window.innerHeight * 0.6, "-" + amount, "bad");
      this.syncHud();
      if (this.health <= 0) { this.health = 0; this.end(false); }
    },

    heal(v) {
      this.health = Math.min(100, this.health + v);
      $("vignette").style.opacity = String(clamp(1 - this.health / 60, 0, 0.7));
      this.syncHud();
    },

    addScore(v, point) {
      const gained = Math.round(v * this.mult);
      this.score += gained;
      if (point) this.showFloater(point, "+" + gained);
      this.syncHud();
    },

    onKill(dino) {
      this.kills++;
      this.combo += 2;
      this.comboT = 2.6;
      this.center = dino.center(new THREE.Vector3());
      this.addScore(dino.cfg.score, this.center);
      this.showFloater(this.center, dino.cfg.label + " SEDATED");
      if (dino.cfg.boss) {
        this.showBanner("REX DOWN", "PADDOCK NINE SECURED", 3);
        this.railU = Math.max(this.railU, 0.965);
      }
    },

    shake(v) { this.shakeAmt = Math.min(1.4, this.shakeAmt + v); },

    /* --------------------------------- HUD -------------------------------- */
    syncHud() {
      $("score").textContent = this.score.toLocaleString();
      $("rescued").textContent = this.rescued;
      $("dna").textContent = this.dna;
      $("health").style.width = clamp(this.health, 0, 100) + "%";
      const comboEl = $("combo");
      comboEl.textContent = this.combo >= 5 ? `COMBO x${this.combo} · ${this.mult.toFixed(1)}×` : "";
      // darts
      const box = $("ammoicons");
      const w = this.weapon;
      if (box.children.length !== w.magSize) {
        box.innerHTML = "";
        for (let i = 0; i < w.magSize; i++) box.appendChild(Object.assign(document.createElement("div"), { className: "dart" }));
      }
      for (let i = 0; i < w.magSize; i++) box.children[i].className = i < w.mag ? "dart" : "dart spent";
      if (!w.reloading) $("reloadmsg").textContent = w.reserve > 0 ? "RESERVE " + w.reserve : "RESERVE LOW";
    },

    setObjective(txt) { $("objective").textContent = txt; },

    showBanner(big, small, dur) {
      const b = $("banner");
      b.querySelector(".big").textContent = big || "";
      b.querySelector(".small").textContent = small || "";
      b.classList.remove("hidden");
      this.bannerT = dur || 2;
    },

    floaterScreen(x, y, text, cls) {
      const el = document.createElement("div");
      el.className = "floater " + (cls || "");
      el.textContent = text;
      el.style.left = x + "px";
      el.style.top = y + "px";
      $("floaters").appendChild(el);
      setTimeout(() => el.remove(), 900);
    },

    showFloater(worldPoint, text, cls) {
      if (!worldPoint) return;
      tmpV2.copy(worldPoint).project(camera);
      if (tmpV2.z > 1) return;
      const x = (tmpV2.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-tmpV2.y * 0.5 + 0.5) * window.innerHeight;
      this.floaterScreen(x, y, text, cls);
    },

    /* ------------------------------- waves -------------------------------- */
    spawnWave(list) {
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(cameraRig.quaternion);
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(cameraRig.quaternion);
      let delay = 0;
      const hpMul = 1 + this.zoneIndex * 0.1;
      const bossMul = 1;
      list.forEach(([type, count]) => {
        for (let i = 0; i < count; i++) {
          const cfg = DINO_TYPES[type];
          const flying = cfg.ai === "flyer";
          const pos = new THREE.Vector3()
            .copy(cameraRig.position)
            .addScaledVector(forward, rand(cfg.ai === "charger" ? 55 : 34, 78))
            .addScaledVector(right, rand(-24, 24));
          pos.y = flying ? rand(11, 16) : 0;
          this.pending.push({ type, pos, t: delay, hpMul: cfg.boss ? bossMul : hpMul });
          delay += rand(0.12, 0.5);
        }
      });
    },

    updateWaves(dt) {
      // release queued spawns
      for (let i = this.pending.length - 1; i >= 0; i--) {
        const p = this.pending[i];
        p.t -= dt;
        if (p.t <= 0) {
          const d = new Dino(p.type, p.pos, { hpMul: p.hpMul });
          if (DINO_TYPES[p.type].boss) Audio.roar(0.75);
          this.pending.splice(i, 1);
        }
      }

      if (this.inEncounter) {
        const alive = enemies.filter((e) => !e.dead).length + this.pending.length;
        this.setObjective(alive > 0 ? `SEDATE ${alive} HOSTILE${alive > 1 ? "S" : ""}` : "ROAD CLEAR");
        if (alive === 0) {
          this.inEncounter = false;
          this.beatIndex++;
          this.addScore(300);
          this.showBanner("", "ROAD CLEAR — MOVING OUT", 1.2);
          this.setObjective("DRIVE ON");
          if (this.weapon.mag < this.weapon.magSize) this.reload();
        }
        return;
      }

      const beat = this.zone.beats[this.beatIndex];
      if (beat && this.railU >= beat.u) {
        this.inEncounter = true;
        this.encounterT = 0;
        this.spawnWave(beat.wave);
        if (beat.msg) this.showBanner(beat.boss ? "WARNING" : "", beat.msg, beat.boss ? 3 : 1.8);
        if (beat.boss) Game.shake(1.2);
      }
    },

    /* ------------------------------- per frame ---------------------------- */
    update(dt) {
      const w = this.weapon;
      if (w.cd > 0) w.cd -= dt;
      if (w.reloading) {
        w.reloadT -= dt;
        if (w.reloadT <= 0) {
          w.reloading = false;
          const need = w.magSize - w.mag;
          const take = w.reserve > 0 ? Math.min(need, w.reserve) : Math.min(need, 4);
          w.reserve = Math.max(0, w.reserve - take);
          w.mag += take || 4;
          w.mag = Math.min(w.mag, w.magSize);
          $("reloadmsg").textContent = "";
          this.syncHud();
        }
      }
      if (w.mag <= 0 && !w.reloading) this.reload();
      w.recoil = Math.max(0, w.recoil - dt * 7);
      muzzleFlash.intensity = Math.max(0, muzzleFlash.intensity - dt * 26);
      rifle.position.set(0.5 + Math.sin(clock * 1.3) * 0.006, -0.44 + Math.cos(clock * 1.7) * 0.006, -0.85 + w.recoil * 0.1);
      rifle.rotation.set(0.05 - w.recoil * 0.22, 0.07, 0.03);

      if (this.comboT > 0) { this.comboT -= dt; if (this.comboT <= 0) { this.combo = 0; this.syncHud(); } }
      if (this.bannerT > 0) { this.bannerT -= dt; if (this.bannerT <= 0) $("banner").classList.add("hidden"); }
      if (firing) this.fire();

      // rail movement
      if (!this.inEncounter && this.zoneClearT === 0) {
        this.railU += (this.railSpeed * dt) / pathLength;
      }
      if (this.railU >= 0.999) {
        this.railU = 0.999;
        if (this.zoneClearT === 0) {
          this.zoneClearT = 0.01;
          const bonus = 1200 + Math.round(this.health * 25);
          this.score += bonus;
          if (this.zoneIndex >= ZONES.length - 1) { this.end(true); return; }
          this.showBanner("SECTOR CLEAR", `+${bonus.toLocaleString()} BONUS`, 2.6);
          Audio.stage();
        }
      }
      if (this.zoneClearT > 0) {
        this.zoneClearT += dt;
        if (this.zoneClearT > 3.2) { this.startZone(this.zoneIndex + 1); return; }
      }

      this.updateWaves(dt);

      // camera along the rail
      const u = clamp(this.railU, 0, 1);
      const p = path.getPointAt(u);
      const ahead = path.getPointAt(Math.min(1, u + 0.008));
      const moving = !this.inEncounter && this.zoneClearT === 0;
      const bob = moving ? Math.sin(clock * 9) * 0.05 + Math.sin(clock * 5.3) * 0.03 : Math.sin(clock * 1.6) * 0.012;
      cameraRig.position.set(p.x, 2.75 + bob, p.z);
      faceAlong(cameraRig, ahead.x - p.x, ahead.z - p.z);
      cameraRig.rotation.z = moving ? Math.sin(clock * 3.1) * 0.012 : 0;
      this.playerPos.set(p.x, 1.6, p.z);
      this.forward.set(0, 0, -1).applyQuaternion(cameraRig.quaternion).setY(0).normalize();

      // free look + shake
      this.shakeAmt = Math.max(0, this.shakeAmt - dt * 2.2);
      const sh = this.shakeAmt;
      camera.rotation.set(
        pointer.ndc.y * 0.16 + rand(-sh, sh) * 0.03,
        -pointer.ndc.x * 0.3 + rand(-sh, sh) * 0.03,
        rand(-sh, sh) * 0.02
      );

      // headlight follow
      tmpV.set(0, 0, -1).applyQuaternion(cameraRig.quaternion);
      fillLight.position.copy(cameraRig.position).addScaledVector(tmpV, 7).setY(3.4);

      $("progress").style.width = (u * 100).toFixed(1) + "%";
    },
  };

  // ---------------------------------------------------------------------------
  // Ambient world updates (venom, pickups, weather, reticle feedback)
  // ---------------------------------------------------------------------------
  let clock = 0;
  let reticleTick = 0;

  function updateVenom(dt) {
    for (let i = venom.length - 1; i >= 0; i--) {
      const v = venom[i];
      v.life -= dt;
      v.mesh.position.addScaledVector(v.dir, 26 * dt);
      v.mesh.scale.setScalar(0.5 + Math.sin(clock * 20) * 0.08);
      const d = v.mesh.position.distanceTo(Game.playerPos);
      if (d < 2.0) {
        spawnSpark(v.mesh.position, 0x8dff5a, 1.2);
        Game.damagePlayer(v.dmg, null);
        v.remove();
      } else if (v.life <= 0 || v.mesh.position.y < 0.2) {
        spawnSpark(v.mesh.position, 0x8dff5a, 0.6);
        v.remove();
      }
    }
  }

  function updatePickups(dt) {
    for (const p of pickups) {
      if (p.taken) continue;
      p.t += dt;
      if (p.kind === "dna") {
        p.group.rotation.y += dt * 1.6;
        p.group.position.y = Math.sin(p.t * 2) * 0.16;
      } else if (p.kind === "rescue") {
        const arm = p.group.userData.wave;
        if (arm) arm.rotation.z = -1.9 + Math.sin(p.t * 7) * 0.5;
        p.group.children[0].material.opacity = 0.28 + Math.sin(p.t * 6) * 0.18;
      } else {
        p.group.position.y = Math.sin(p.t * 1.6) * 0.08;
      }
    }
  }

  function updateWeather(dt) {
    if (!weather) return;
    weather.group.position.set(cameraRig.position.x, 0, cameraRig.position.z);
    const pos = weather.geo.attributes.position;
    const fall = weather.storm ? 26 : 1.6;
    const drift = weather.storm ? 4 : 1.2;
    for (let i = 0; i < pos.count; i++) {
      let y = pos.getY(i) - fall * dt;
      let x = pos.getX(i) + drift * dt;
      if (y < 0.2) { y = rand(18, 24); x = rand(-60, 60); }
      if (x > 60) x -= 120;
      pos.setY(i, y);
      pos.setX(i, x);
    }
    pos.needsUpdate = true;

    if (weather.storm) {
      weather.nextFlash -= dt;
      if (weather.nextFlash <= 0) {
        weather.nextFlash = rand(4, 11);
        weather.flash = 1;
        Audio.thunder();
      }
      if (weather.flash > 0) {
        weather.flash -= dt * 3.4;
        lightningLight.intensity = Math.max(0, weather.flash) * 2.6 * (Math.random() < 0.5 ? 1 : 0.4);
      } else lightningLight.intensity = 0;
    }
  }

  function updateReticle() {
    if (isTouch) return;
    raycaster.setFromCamera(pointer.ndc, camera);
    const hits = raycaster.intersectObjects(hitTargets, true);
    let hot = false;
    for (const h of hits) {
      if (h.object.userData.noHit) continue;
      let o = h.object;
      while (o) {
        if (o.userData.dinoRef && !o.userData.dinoRef.dead) { hot = true; break; }
        if (o.userData.pickupRef) { hot = true; break; }
        o = o.parent;
      }
      break;
    }
    $("reticle").classList.toggle("hot", hot);
  }

  // ---------------------------------------------------------------------------
  // Attract mode + main loop
  // ---------------------------------------------------------------------------
  let attractU = 0;

  function attractUpdate(dt) {
    attractU += (7 * dt) / pathLength;
    if (attractU > 0.98) attractU = 0;
    const p = path.getPointAt(attractU);
    const ahead = path.getPointAt(Math.min(1, attractU + 0.01));
    cameraRig.position.set(p.x, 3.1 + Math.sin(clock * 1.2) * 0.1, p.z);
    faceAlong(cameraRig, ahead.x - p.x, ahead.z - p.z);
    camera.rotation.set(0.02, Math.sin(clock * 0.28) * 0.25, 0);
  }

  let last = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    clock += dt;

    if (Game.state === "playing") {
      Game.update(dt);
      for (let i = enemies.length - 1; i >= 0; i--) enemies[i].update(dt, Game.playerPos);
      updateVenom(dt);
      updatePickups(dt);
      if (++reticleTick % 3 === 0) updateReticle();
    } else if (Game.state === "title" || Game.state === "over") {
      attractUpdate(dt);
      updatePickups(dt);
    }

    for (let i = fx.length - 1; i >= 0; i--) if (!fx[i].update(dt)) fx.splice(i, 1);
    updateWeather(dt);

    renderer.render(scene, camera);
  }

  // ---------------------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------------------
  function toTitle() {
    Game.state = "title";
    firing = false;
    $("hud").classList.add("hidden");
    $("reticle").classList.add("hidden");
    $("banner").classList.add("hidden");
    $("pausescreen").classList.add("hidden");
    $("endscreen").classList.add("hidden");
    $("titlescreen").classList.remove("hidden");
    $("vignette").style.opacity = "0";
    buildZone(0);
    attractU = 0;
  }

  $("startbtn").addEventListener("click", () => { Audio.init(); Audio.resume(); Game.start(); });
  $("againbtn").addEventListener("click", () => { Audio.resume(); Game.start(); });
  $("resumebtn").addEventListener("click", () => Game.togglePause());
  $("quitbtn").addEventListener("click", () => toTitle());
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && Game.state === "playing") Game.togglePause();
  });

  // Debug handle (harmless in production; used by the smoke test)
  window.DINO = { THREE, scene, camera, cameraRig, Game, Dino, DINO_TYPES, enemies, pickups, ZONES, worldGroup };

  $("loading").textContent = "SYSTEMS ONLINE";
  buildZone(0);
  Game.syncHud();
  requestAnimationFrame(frame);
})();
