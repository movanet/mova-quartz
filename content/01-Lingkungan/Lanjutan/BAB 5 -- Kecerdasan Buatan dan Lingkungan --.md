---
publish: true
bab: "5"
judul: "Kecerdasan Buatan dan Lingkungan"
level: "S2"
pertemuan: "5"
durasi_baca: "150 menit"
tags:
  - buku-ajar
  - hukum-01-Lingkungan
  - hukum-lingkungan-lanjutan
  - kecerdasan-buatan
  - pusat-data
  - air
  - energi
---

> [!info] Atribusi
> Modul ini diorkestrasi oleh **[[Mohamad Mova AlAfghani -- Curriculum Vitae|Mohamad Mova AlAfghani]]** menggunakan **Claude** beserta beberapa model bahasa besar (*large language model*) dan *harness* pendukungnya.

> [!abstract] Ringkasan Perkuliahan (Audio)
> Rekaman pendek yang meringkas materi bab ini, tiga sampai lima menit per bagian: [[01-Lingkungan/Lanjutan/Kuliah-Audio-Lanjutan#Pertemuan 5 — Kecerdasan Buatan dan Lingkungan|Dengarkan Pertemuan 5 — Kecerdasan Buatan dan Lingkungan]].

# BAB 5: Kecerdasan Buatan dan Lingkungan

---

## A. PENDAHULUAN

### 1. Capaian Pembelajaran (Sub-CPMK)

Setelah menyelesaikan bab ini, mahasiswa mampu:

1. **Menguji** angka jejak energi dan air kecerdasan buatan (AI) dengan menelusuri batas sistem, lingkup air, dan metode yang dipakai setiap sumber.
2. **Membandingkan** kewajiban lingkungan pusat data di Uni Eropa, Indonesia, dan Singapura menurut pemicu hukumnya, tingkat keterbukaan datanya, dan tuas penegakannya.
3. **Menafsirkan** secara kritis apa yang sebenarnya diwajibkan EU AI Act tentang energi, dan membedakannya dari reputasi publiknya.
4. **Menilai** klaim "AI hijau" dengan kerangka hukum greenwashing, termasuk Directive (EU) 2024/825 dan Pasal 8 UU 8/1999.
5. **Merumuskan** pertanyaan riset tesis tentang pengaturan pusat data di Indonesia.

### 2. Indikator Pencapaian

- [ ] Dapat menjelaskan mengapa angka 0,24 Wh (Google) dan 0,42 Wh (tolok ukur independen) tidak dapat dibandingkan begitu saja.
- [ ] Dapat membedakan air yang diambil (*withdrawal*) dari air yang dikonsumsi (*consumption*), serta lingkup 1, 2, dan 3 dalam akuntansi air.
- [ ] Dapat menunjukkan pasal EED dan Delegated Regulation 2024/1364 yang mewajibkan pelaporan, dan pasal yang membatasi publikasinya menjadi agregat.
- [ ] Dapat menjelaskan ambang AMDAL pusat data menurut Permen LHK 4/2021 dan celah klasifikasi dalam PP 33/2023.
- [ ] Dapat menjelaskan mengapa Singapura "menggerbangi" energi tetapi hanya "menargetkan" air.

### 3. Deskripsi Singkat

Pada Mei 2025 Google mengumumkan bahwa satu *prompt* teks median ke asisten Gemini memakai 0,24 Wh listrik dan 0,26 mL air, kira-kira lima tetes. Beberapa bulan sebelumnya, sebuah tolok ukur akademik menghitung 0,42 Wh untuk satu kueri pendek ke GPT-4o. Dua tahun sebelumnya, sebuah makalah yang banyak dikutip menyebut GPT-3 "meminum" satu botol air 500 mL untuk setiap 10 sampai 50 jawaban. Ketiga angka itu tidak saling membantah, dan tidak pula saling menguatkan. Masing-masing menghitung hal yang berbeda.

Bagi sarjana hukum, pertanyaannya bukan angka mana yang benar, melainkan siapa yang menetapkan cara menghitung, siapa yang wajib melapor, siapa yang boleh membaca laporannya, dan apa akibatnya bila angka itu buruk. Uni Eropa mewajibkan pelaporan tetapi menerbitkan data agregat. EU AI Act hanya meminta energi yang "known or estimated". Indonesia menyaring pusat data menurut luas lahan. Singapura mengaitkan alokasi kapasitas dengan efisiensi energi, tetapi tidak dengan air.

### 4. Relevansi

Indonesia sedang menjadi tujuan investasi pusat data. Kapasitasnya dilaporkan 2.002 MW pada 2024, kedua di ASEAN, menurut [ulasan Prolegal atas perizinan pusat data](https://prolegal.id/perizinan-data-center-indonesia-bagaimana-perizinannya/). Setiap megawatt membutuhkan sambungan listrik, air pendingin, dan lahan, yaitu objek hukum lingkungan dan sumber daya alam yang sudah dikenal. Yang baru adalah skala dan kecepatannya, serta kenyataan bahwa angka dampaknya hampir seluruhnya dilaporkan sendiri oleh perusahaan. Sarjana hukum yang kelak menyusun AMDAL, menguji izin di PTUN, atau merancang peraturan menteri perlu tahu angka mana yang dapat dipercaya dan instrumen mana yang benar-benar mengikat.

Dimensi emisi gas rumah kaca dari pusat data dibahas dalam mata kuliah [[06-PerubahanIklim/index|Hukum Perubahan Iklim]]. Bab ini membatasi diri pada energi sebagai beban sumber daya, air, lokasi, dan klaim lingkungan.

---

## B. PENYAJIAN MATERI

### 1. Besaran Beban dan Mengapa Angkanya Berbeda

#### 1.1 Angka makro

Titik tolak yang paling dapat dipertanggungjawabkan adalah Badan Energi Internasional (IEA). Dalam bab [*Energy demand from AI*](https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai), IEA memperkirakan konsumsi listrik pusat data dunia sekitar 415 TWh pada 2024, atau sekitar 1,5% dari konsumsi listrik global. Dalam skenario dasarnya, angka itu naik hampir dua kali lipat menjadi sekitar 945 TWh pada 2030. Pendorongnya adalah server terakselerasi, yaitu server dengan cip khusus untuk AI, yang konsumsinya diperkirakan tumbuh sekitar 30% per tahun, dibandingkan sekitar 9% untuk server konvensional. IEA juga memperkirakan permintaan listrik pusat data di Asia Tenggara lebih dari dua kali lipat pada 2030.

Menurut IEA, pendinginan menyerap antara 7% (fasilitas hyperscale yang efisien) sampai lebih dari 30% (fasilitas enterprise yang kurang efisien) listrik pusat data. Rentang ini menjelaskan mengapa dua pusat data yang sama besarnya dapat memiliki beban lingkungan yang sangat berbeda.

Konsiderans 85 [Energy Efficiency Directive (EU) 2023/1791](https://eur-lex.europa.eu/eli/dir/2023/1791/oj/eng) mencatat konsumsi energi pusat data UE sebesar 76,8 TWh pada 2018 dan memproyeksikan 98,5 TWh pada 2030. Untuk air, sebuah [tinjauan tentang pusat data AI dan jaringan listrik](https://arxiv.org/abs/2509.07218) mengutip IEA bahwa pusat data 100 MW di Amerika Serikat memakai sekitar 2 juta liter air per hari. Angka kutipan ulang ini sebaiknya dibaca sebagai orde besaran.

#### 1.2 Angka per kueri dan masalah batas sistem

Angka makro relatif stabil. Perdebatan muncul pada angka per kueri, karena di situlah pilihan metodologis menentukan hasil. Ada empat sumber yang perlu dibaca berdampingan.

**Pertama, laporan Google.** Makalah insinyur Google, [*Measuring the environmental impact of delivering AI at Google scale*](https://arxiv.org/abs/2508.15734), melaporkan 0,24 Wh dan 0,26 mL air untuk prompt teks median Gemini Apps (Mei 2025). Google menyebut metodenya "komprehensif" karena memasukkan daya akselerator, CPU dan memori host, kapasitas mesin yang menganggur, dan overhead fasilitas melalui PUE (*power usage effectiveness*, rasio seluruh energi fasilitas terhadap energi peralatan TI). Untuk air, Google memakai WUE kategori 2 versi ISO, yaitu konsumsi (air masuk dikurangi air yang dikembalikan), dengan nilai rata-rata armadanya 1,15 L/kWh. Google juga mengklaim penurunan energi 33 kali dan jejak karbon 44 kali per prompt dalam satu tahun. Makalah itu sendiri mengakui belum ada konsensus tentang batas pengukuran. Ini laporan diri perusahaan tentang dirinya sendiri, tanpa audit independen yang dijelaskan dalam teksnya.

**Kedua, tolok ukur independen.** Makalah [*How Hungry is AI?*](https://arxiv.org/abs/2505.09598) mengukur 30 model bahasa. Untuk GPT-4o, hasilnya 0,42 Wh (±0,13 Wh) per prompt pendek, atau 0,37 Wh tanpa overhead pusat data. Angka ini berada *within 19%* dari 0,34 Wh yang diungkapkan pimpinan OpenAI pada Juni 2025. Dengan asumsi 700 juta kueri GPT-4o per hari, konsumsi tahunannya melampaui listrik 35.000 rumah tangga di Amerika Serikat, dan air yang menguap mencapai 1,33 sampai 1,58 juta kiloliter. Disiplin metodologisnya dinyatakan terang: hanya fase inferensi, hanya konsumsi (bukan pengambilan), air di lokasi ditambah air di pembangkit listrik, tanpa air rantai pasok. Rentang antarmodel juga lebar. Model yang sama bisa turun lebih dari 70% konsumsinya bila dijalankan di infrastruktur lain.

**Ketiga, makalah yang memopulerkan angka "botol air".** Li dan kawan-kawan dalam [*Making AI Less "Thirsty"*](https://arxiv.org/abs/2304.03271) memperkenalkan tiga lingkup akuntansi air: lingkup 1 adalah air yang diuapkan di lokasi untuk pendinginan; lingkup 2 adalah air yang dikonsumsi di pembangkit listrik yang memasok pusat data; lingkup 3 adalah air yang terkandung dalam rantai pasok, misalnya pembuatan cip. Makalah ini juga membedakan *withdrawal* (seluruh air yang diambil, termasuk yang dikembalikan) dari *consumption* (bagian yang menguap dan tidak kembali). Angka 500 mL per 10 sampai 50 jawaban adalah estimasi penulis, dibangun dari angka PUE dan WUE yang dipublikasikan Microsoft dan asumsi energi per permintaan, bukan pengukuran. Makalah yang sama mencatat bahwa WUE lokasi berkisar 1 sampai 9 L/kWh antarfasilitas.

**Keempat, pembanding tandingan.** Makalah di *Scientific Reports*, [*Reconciling the contrasting narratives on the environmental impact of large language models*](https://doi.org/10.1038/s41598-024-76682-6), mengubah pertanyaannya: berapa jejak menulis satu halaman 500 kata oleh model bahasa dibandingkan oleh manusia? Dengan asumsi eksplisit (PUE 1,17; WUE lokasi 0,55 L/kWh; air pembangkit 3,14 L/kWh; jejak tertanam digandakan), model bahasa jauh lebih hemat per tugas. Para penulisnya sendiri memperingatkan bahwa hasil itu bergantung pada asumsi penggandaan dan dapat berbalik bila model terus membesar.

Satu lagi layak dicatat. Mistral AI, bersama konsultan Carbone 4 dan badan lingkungan Prancis ADEME, menerbitkan [analisis daur hidup model Mistral Large 2](https://mistral.ai/news/our-contribution-to-a-global-environmental-standard-for-ai): pelatihan menghabiskan sekitar 281.000 m³ air, dan satu jawaban 400 token memakai sekitar 45 mL air dan 1,14 g CO2e. Mistral menyebut hasilnya *first approximation* karena belum ada standar dan belum ada faktor dampak publik untuk daur hidup GPU.

#### 1.3 Pelajaran untuk hukum

Dari keempat sumber itu dapat ditarik tiga pelajaran.

Pertama, selisih angka sebagian besar berasal dari **batas sistem**. Apakah overhead fasilitas masuk? Apakah kapasitas menganggur dihitung? Apakah air pembangkit (lingkup 2) masuk? Apakah pelatihan diamortisasi ke setiap kueri? Angka Google yang rendah dan angka Li yang tinggi dapat sama-sama benar dalam batasnya masing-masing.

Kedua, pilihan antara **withdrawal** dan **consumption** bukan soal teknis semata. Bagi hukum sumber daya air, yang diatur dalam izin adalah pengambilan. Air yang diambil lalu dikembalikan tetap mengurangi ketersediaan sesaat di sungai atau akuifer, dan dapat kembali dalam suhu atau mutu yang berbeda. Sebaliknya, air yang dikonsumsi hilang dari daerah aliran sungai itu. Angka "konsumsi" yang rendah tidak menjawab pertanyaan pemberi izin tentang berapa air yang akan diambil.

Ketiga, hampir seluruh angka per kueri adalah **laporan diri** dengan metode pilihan pelapor. Selama hukum tidak menetapkan metode, dua laporan yang sama-sama jujur tidak dapat dibandingkan, dan laporan yang tidak jujur sulit dibuktikan. Bagian selanjutnya membaca setiap instrumen dengan pertanyaan itu.

### 2. Uni Eropa: Mengikat, tetapi Dipublikasikan secara Agregat

#### 2.1 Pasal 12 dan Annex VII EED

Pasal 12 ayat (1) [EED 2023/1791](https://eur-lex.europa.eu/eli/dir/2023/1791/oj/eng) berbunyi: "By 15 May 2024 and every year thereafter, Member States shall require owners and operators of data centres in their territory with a power demand of the installed information technology (IT) of at least 500kW, to make the information set out in Annex VII publicly available", dengan pengecualian informasi yang dilindungi sebagai rahasia dagang. Annex VII memuat informasi minimum, termasuk konsumsi energi, pemanfaatan daya, titik setel suhu, pemanfaatan panas buang, pemakaian air, dan pemakaian energi terbarukan.

Tiga ayat berikutnya menentukan watak kewajiban itu. Ayat (3) memerintahkan Komisi membangun basis data Eropa yang "publicly available on an aggregated level". Ayat (4) hanya mewajibkan negara anggota *encourage* pusat data berdaya TI 1 MW ke atas untuk mengikuti *European Code of Conduct on Data Centre Energy Efficiency*. Ayat (5) meminta Komisi menilai data yang masuk paling lambat 15 Mei 2025 dan, bila perlu, mengajukan usulan legislasi, termasuk standar kinerja minimum. Artinya, standar kinerja minimum belum ada; yang ada baru kewajiban mengukur dan melapor.

Code of Conduct itu sendiri sukarela, tetapi menurut [catatan JRC atas Best Practice Guidelines 2025](https://publications.jrc.ec.europa.eu/repository/handle/JRC141521) ia dirujuk oleh Pasal 12 EED dan oleh kriteria taksonomi UE untuk pusat data.

#### 2.2 Delegated Regulation (EU) 2024/1364

Rincian teknisnya diatur [Delegated Regulation (EU) 2024/1364](https://eur-lex.europa.eu/eli/reg_del/2024/1364/oj/eng). Pasal 3 ayat (1) mewajibkan operator menyampaikan informasi dan indikator kinerja kunci "By 15 September 2024, then by 15 May 2025, and every year thereafter". Lampirannya menetapkan rumus: PUE sebagai rasio energi fasilitas terhadap energi TI, dan WUE sebagai rasio total air masuk (WIN) terhadap energi TI. WIN diukur menurut standar EN 50600-4-9 kategori 2, atau kategori 1 bila tidak memungkinkan, dan mencakup "all water volumes that enter the data centre boundary".

Perhatikan pilihan metodenya. WUE regulasi ini dihitung dari air *masuk*, lebih dekat ke pengambilan, sedangkan Google menghitung konsumsi. Hukum Eropa sudah memilih batas sistem untuk pelaporan fasilitas, tetapi tidak untuk angka per kueri yang dipublikasikan perusahaan.

Pasal 4 ayat (2) menyatakan informasi dan indikator kinerja "shall be made public in an aggregated manner, at Member State and Union level". Pasal 4 ayat (5) mewajibkan Komisi dan negara anggota merahasiakan data per fasilitas, dengan dasar kepentingan komersial menurut Pasal 4(2) Regulation 1049/2001 dan Pasal 4(2)(d) Directive 2003/4/EC tentang akses publik atas informasi lingkungan.

#### 2.3 Bukan soft law

Ada godaan untuk menggolongkan rezim ini sebagai "lunak" karena publikasinya agregat. Penggolongan itu keliru. Pasal 12 EED adalah kewajiban negara anggota dalam direktif yang mengikat, dan pelanggarannya dapat dibawa Komisi ke Pengadilan Uni Eropa melalui prosedur pelanggaran Pasal 258 dan 260 TFEU. Mesin yang sama pernah terbukti menggigit dalam perkara lingkungan lain. Dalam perkara tambang Turów (C-121/21 R), Wakil Presiden Pengadilan menjatuhkan denda harian EUR 500.000 kepada Polandia karena tidak menghentikan penambangan yang melanggar kewajiban penilaian dampak lingkungan, sebagaimana diumumkan dalam [siaran pers Pengadilan Uni Eropa](https://curia.europa.eu/site/upload/docs/application/pdf/2021-09/cp210159en.pdf). Polandia menolak membayar, lalu Komisi memotong sekitar EUR 68,5 juta dari alokasi dana UE untuk Polandia, dan pada Mei 2024 Pengadilan menolak keberatan Polandia, menurut [laporan Notes from Poland](https://notesfrompoland.com/2024/05/30/eu-court-rejects-polands-complaint-over-unpaid-coal-mine-fines/). Turów bukan perkara EED, tetapi perkara itu menunjukkan bahwa kewajiban dalam tatanan hukum UE punya tangan yang dapat menariknya.

Kelemahan EED karena itu terletak pada **granularitas publikasi**. Regulator dapat membaca angka per fasilitas, tetapi masyarakat sekitar, peneliti, dan pesaing tidak, dan belum ada ambang kinerja yang dapat dilanggar. Pengajar berpendapat bahwa ini pilihan desain yang disengaja, bukan kelemahan daya ikat. Memperbaiki EED tidak memerlukan hukum yang "lebih keras", melainkan keputusan politik tentang siapa yang berhak membaca data. [Kajian *No End in Sight?*](https://doi.org/10.1177/10860266231168905) mengingatkan bahwa negara dapat ikut memfasilitasi greenwashing "if they enact legislation on environmental disclosure without also enforcing environmental performance improvements".

### 3. EU AI Act: Apa yang Sebenarnya Diwajibkan tentang Energi

#### 3.1 Reputasi dan teks

EU AI Act, yaitu [Regulation (EU) 2024/1689](https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng), sering disebut sebagai undang-undang yang mewajibkan transparansi energi AI. Teksnya jauh lebih sempit.

[Pasal 53](https://artificialintelligenceact.eu/article/53/) ayat (1) huruf a mewajibkan penyedia model AI serbaguna (*general-purpose AI*, GPAI) menyusun dan memelihara dokumentasi teknis yang memuat sekurang-kurangnya informasi dalam Annex XI. [Annex XI](https://artificialintelligenceact.eu/annex/11/) Bagian 1 angka 2 huruf e meminta "known or estimated energy consumption of the model", dan menambahkan bahwa bila konsumsi energinya tidak diketahui, angka itu boleh didasarkan pada informasi tentang sumber daya komputasi yang dipakai. Huruf d yang mendahuluinya meminta informasi sumber daya komputasi untuk melatih model, misalnya jumlah operasi floating point.

Dokumentasi ini disusun untuk AI Office dan otoritas yang berwenang, bukan untuk publik. Menurut [analisis White & Case](https://www.whitecase.com/insight-alert/energy-efficiency-requirements-under-eu-ai-act), AI Office dapat meminta dokumentasi itu, dan kewajiban tersebut hanya melekat pada penyedia, bukan pada pengguna hilir (*deployer*). Penyedia model yang dipasarkan sejak 2 Agustus 2025 langsung terikat, sedangkan model yang sudah beredar sebelumnya memperoleh tenggang sampai 2 Agustus 2027. Sanksi untuk pelanggaran kewajiban penyedia GPAI dapat mencapai EUR 15 juta atau 3% omzet dunia, mana yang lebih besar.

Jadi yang diwajibkan adalah: satu angka energi, untuk model (bukan untuk setiap kueri atau pusat data), boleh berupa perkiraan, disampaikan kepada regulator. Tidak ada batas energi, tidak ada ketentuan tentang air, dan tidak ada kewajiban publikasi per model.

#### 3.2 Standardisasi sebagai janji

[Pasal 40](https://artificialintelligenceact.eu/article/40/) ayat (2) meminta Komisi menyertakan dalam permintaan standardisasi "deliverables on reporting and documentation processes to improve AI systems' resource performance", termasuk konsumsi energi dan sumber daya lain sepanjang daur hidup, serta pengembangan model GPAI yang efisien energi. Yang diminta adalah proses pelaporan dan dokumentasi, bukan batas numerik.

Pekerjaan itu berada di tangan komite teknis gabungan CEN-CENELEC JTC 21. Menurut [halaman resmi CEN-CENELEC](https://www.cencenelec.eu/areas-of-work/cen-cenelec-topics/artificial-intelligence/), standar harmonisasi yang dimuat dalam Jurnal Resmi UE akan melahirkan praduga kesesuaian dengan AI Act. [Ikhtisar kerja JTC 21](https://jtc21.eu/wp-content/uploads/2025/06/CEN-CENELEC-JTC21-AI-Standards-Complete-Detailed-Overview.pdf) mencatat bahwa kelompok kerja WG4 sudah menerbitkan laporan teknis CEN/CLC/TR 18145:2025 tentang pertimbangan lingkungan AI, dan sedang menyusun Spesifikasi Teknis tentang pedoman dan metrik AI berkelanjutan yang mencakup metode pengukuran konsumsi energi. Target penyelesaian 2026 adalah sasaran badan standardisasi, bukan tenggat hukum.

Selama standar itu belum dimuat di Jurnal Resmi, perkiraan mandiri penyedia tetap menjadi satu-satunya metode. Menurut White & Case, laporan berkala Komisi tentang kemajuan standardisasi efisiensi energi GPAI baru jatuh tempo pertama kali pada 2 Agustus 2028, dan laporan itu dapat memuat rekomendasi tindakan korektif yang mengikat.

#### 3.3 Perdebatan: kesempatan yang terlewat, atau urutan yang wajar?

Posisi kritis diwakili [tulisan Heinrich Böll Stiftung](https://eu.boell.org/en/2024/04/08/eu-ai-act-missed-opportunity). Menurut tulisan itu, teks Parlemen Eropa 2023 memuat kewajiban yang jauh lebih keras: prinsip keberlanjutan, pencatatan energi untuk sistem berisiko tinggi, penilaian dampak lingkungan sepanjang daur hidup, dan dampak lingkungan sebagai unsur penilaian dampak hak fundamental. Semuanya hilang dalam kesepakatan trilog Desember 2023. Yang tersisa adalah Annex XI yang sempit, Pasal 40 yang prosedural, dan kode perilaku sukarela. Tulisan ini adalah posisi advokasi dan perlu dikutip sebagai kritik, bukan sebagai uraian doktrinal.

Posisi yang lebih ramah terhadap teks akhir: hukum tidak dapat menetapkan batas energi sebelum ada metode pengukuran yang disepakati, karena setiap penyedia akan memilih batas sistem yang paling menguntungkan. Urutan "dokumentasi dulu, standar kemudian, batas bila perlu" masuk akal secara regulatoris.

Pengajar berpendapat kedua posisi dapat dipertemukan dengan satu pertanyaan: apakah urutan itu disertai tenggat yang mengikat? EED menetapkan tenggat bagi Komisi untuk menilai perlunya standar kinerja minimum. AI Act hanya menetapkan laporan kemajuan. Bila standar JTC 21 tertunda melewati 2027, kewajiban energi AI Act akan berlaku penuh tanpa metode yang disepakati, dan kritik Böll akan terbukti lebih tepat.

### 4. Indonesia: Menyaring Menurut Luas, Bukan Beban

#### 4.1 Rantai perizinan

Rantai perizinan pusat data di Indonesia dapat direkonstruksi dari beberapa sumber. Menurut [Prolegal](https://prolegal.id/perizinan-data-center-indonesia-bagaimana-perizinannya/) dan [BP Lawyers](https://bplawyers.co.id/2025/01/28/bisnis-data-center-sedang-naik-daun-bagaimana-ketentuan-perizinan-dan-kbli-nya/), usaha pusat data tergolong KBLI 63112 (aktivitas hosting dan yang berhubungan dengan itu), dengan tingkat risiko menengah tinggi menurut [PP 5/2021](https://peraturan.go.id/id/pp-no-5-tahun-2021). Pelaku usaha wajib memiliki NIB dan Sertifikat Standar, dan wajib terdaftar sebagai Penyelenggara Sistem Elektronik lingkup privat menurut Pasal 6 [PP 71/2019](https://peraturan.go.id/id/pp-no-71-tahun-2019). Usaha menengah dan besar wajib berlokasi di kawasan industri atau kawasan peruntukan industri. Kewajiban lingkungannya dalam Sertifikat Standar dirumuskan umum, yaitu mengelola sumber daya alam secara *efisien serta ramah lingkungan*, tanpa angka daya atau air.

[Artikel The Conversation Indonesia](https://theconversation.com/dampak-lingkungan-data-center-tak-bisa-diremehkan-solusinya-tak-cukup-dengan-efisiensi-energi-203168) mengutip PLN (2023): sekitar 94 pusat data berkapasitas 727,1 MW, dan fasilitas 1 MW memakai sekitar 26 juta liter air per tahun untuk pendinginan. Angka ini dan angka 2.002 MW berasal dari tahun dan cara hitung yang berbeda; keduanya tidak dapat diperiksa per fasilitas.

#### 4.2 AMDAL: pusat data tersaring, tetapi dengan ukuran yang salah

Selama ini sering diasumsikan bahwa pusat data tidak tersentuh AMDAL. Asumsi itu keliru. [Permen LHK 4/2021](https://peraturan.go.id/id/permen-lhk-no-4-tahun-2021) tentang daftar usaha yang wajib memiliki AMDAL, UKL-UPL, atau SPPL, sebagai pelaksana [PP 22/2021](https://peraturan.go.id/id/pp-no-22-tahun-2021), mencantumkan KBLI 63111 (aktivitas pengolahan data) dan KBLI 63112 (aktivitas hosting dan ybdi) secara tegas dalam Lampiran I. Keduanya tidak diberi ambang khusus, tetapi diarahkan ke kriteria multisektor. Menurut kriteria itu, usaha wajib AMDAL bila luas lahannya 5 ha atau lebih, atau luas bangunannya 10.000 m² atau lebih. Di bawah itu, UKL-UPL berlaku untuk lahan 1 sampai 5 ha atau bangunan 5.000 sampai 10.000 m², dan sisanya cukup SPPL.

Masalahnya ada pada ukuran pemicunya. Pusat data modern cenderung padat daya: puluhan megawatt dapat ditempatkan di bangunan yang tidak terlalu luas. Fasilitas seperti itu dapat berada di bawah ambang 5 ha dan 10.000 m², sehingga hanya wajib UKL-UPL atau bahkan SPPL, padahal ia menyerap daya dan air dalam jumlah besar. Ironisnya, Alasan Ilmiah untuk kriteria multisektor dalam peraturan itu sendiri menyebut kebutuhan air harian sebagai salah satu pertimbangan. Air sudah masuk dalam logika penyaringan, tetapi tidak dijadikan ukuran.

Pengajar menyimpulkan bahwa pusat data di Indonesia tertangkap secara yurisdiksi, tetapi disaring dengan proksi yang tidak mengikuti beban lingkungannya. Kesimpulan ini dibatasi pada teks peraturan. Dalam korpus riset untuk bab ini tidak ditemukan satu pun dokumen AMDAL, UKL-UPL, atau SPPL pusat data yang dipublikasikan. "Tertangkap di atas kertas" belum sama dengan "diperiksa dalam praktik".

#### 4.3 PP 33/2023: celah klasifikasi

[PP 33/2023 tentang Konservasi Energi](https://peraturan.go.id/id/pp-no-33-tahun-2023), yang mencabut [PP 70/2009](https://peraturan.go.id/id/pp-no-70-tahun-2009), mewajibkan manajemen energi dan pelaporan tahunan bagi pengguna energi di tiga sektor. Sektor transportasi dan industri wajib bila konsumsinya 4.000 TOE (setara ton minyak) per tahun atau lebih (Pasal 31 dan 32). Sektor bangunan gedung wajib bila konsumsinya 500 TOE per tahun atau lebih (Pasal 34), yang menurut Penjelasan setara dengan sekitar 5,8 GWh listrik per tahun atau luas 20.000 m². Pelanggaran dikenai disinsentif berupa peringatan tertulis, pengumuman di media massa, dan rekomendasi pencabutan insentif (Pasal 51).

Kata *pusat data*, *data center*, *KBLI*, *telekomunikasi*, dan *teknologi informasi* tidak muncul sama sekali dalam [teks lengkap PP 33/2023](https://jdih.esdm.go.id/common/dokumen-external/Peraturan%20Pemerintah%20Nomor%2033%20Tahun%202023.pdf) maupun Penjelasannya. Penjelasan Pasal 32 mengartikan sektor industri secara sempit sebagai perusahaan industri tertentu dan perusahaan kawasan industri. Penjelasan Pasal 34 memberi daftar bangunan gedung (perkantoran, perhotelan, pusat perbelanjaan, rumah sakit, dan seterusnya) dengan kata *antara lain*, sehingga daftarnya terbuka.

Hitungan sederhana menunjukkan mengapa klasifikasi ini penting. Satu MW beban TI yang berjalan terus-menerus sepanjang tahun memakai 8,76 GWh, di atas 5,8 GWh. Jadi, bila pusat data digolongkan sebagai bangunan gedung, hampir setiap pusat data berukuran menengah wajib melaksanakan manajemen energi. Bila digolongkan sebagai industri, ambangnya sekitar delapan kali lebih tinggi. Bila tidak digolongkan sama sekali, tidak ada kewajiban. Hitungan ini adalah analisis pengajar, bukan penafsiran resmi. Artikel The Conversation yang dikutip di atas menilai bahwa pusat data Indonesia tidak mencapai ambang pelaporan lama PP 70/2009; penilaian itu kini perlu diuji ulang terhadap ambang bangunan gedung PP 33/2023 yang jauh lebih rendah.

#### 4.4 Air, lokasi, dan habitat

Untuk air, instrumen yang relevan adalah perizinan penggunaan sumber daya air berdasarkan [UU 17/2019](https://peraturan.go.id/id/uu-no-17-tahun-2019). Aturan pelaksananya, [Permen PUPR 2/2024 tentang tata cara perizinan berusaha penggunaan sumber daya air](https://jdih.pu.go.id/detail-dokumen/PermenPUPR-nomor-2-tahun-2024-Tata-Cara-Perizinan-Berusaha-Penggunaan-Sumber-Daya-Air-dan-Persetujuan-Penggunaan-Sumber-Daya-Air), tidak menyebut pusat data sama sekali. Pusat data diperlakukan seperti pengguna air usaha lainnya, tanpa metrik efisiensi seperti WUE.

Lokasi menentukan dampak. Studi [Siddik, Shehabi, dan Marston tentang jejak lingkungan pusat data di Amerika Serikat](https://doi.org/10.1088/1748-9326/abfba1) menemukan sekitar seperlima jejak air langsung server berasal dari daerah aliran sungai yang tertekan air sedang sampai tinggi, dan hampir separuh server dipasok pembangkit di wilayah yang tertekan air. Artinya, lingkup 2 (air pembangkit) sama pentingnya dengan lingkup 1 dalam keputusan lokasi, dan lokasi yang meminimalkan tekanan air belum tentu meminimalkan emisi. Di Indonesia, kewajiban berlokasi di kawasan industri mengarahkan pusat data ke tempat yang sudah memiliki infrastruktur, tetapi tidak menguji tekanan air di wilayah sungai tempat kawasan itu berada.

Untuk habitat, dalam korpus riset tidak ditemukan kajian dampak pusat data terhadap keanekaragaman hayati di Indonesia. Mekanismenya dapat dinalar (konversi lahan, pengambilan air dari sungai kecil, buangan air panas, jaringan transmisi baru), tetapi belum ada bukti empiris yang dapat dikutip. Kerangka perlindungan habitat itu sendiri dibahas di [[01-Lingkungan/Lanjutan/BAB 6 -- Keanekaragaman Hayati dan Perlindungan Habitat --|BAB 6]].

### 5. Singapura sebagai Pembanding: Energi Digerbangi, Air Ditargetkan

Singapura adalah pembanding yang berguna karena ia memakai tuas yang tidak dimiliki Indonesia maupun Uni Eropa: alokasi kapasitas. [Green Data Centre Roadmap IMDA](https://www.imda.gov.sg/how-we-can-help/green-dc-roadmap) mengaitkan pertumbuhan pusat data dengan skema sertifikasi Green Mark for Data Centres (GMDC:2024), hibah efisiensi energi, dan standar SS 715:2025 tentang efisiensi energi peralatan TI. Roadmap itu menyatakan tujuan menyediakan "at least 300 megawatts (MW) of additional capacity in the near term".

[Dokumen Roadmap (Mei 2024)](https://www.imda.gov.sg/assets/c99c4fa7-8fe9-4082-9969-1e86f69375e4) memuat dua target. Untuk energi, IMDA menargetkan semua pusat data mencapai PUE 1,3 atau lebih rendah pada beban TI 100% dalam sepuluh tahun. Untuk air, IMDA akan bekerja dengan Public Utilities Board (PUB) untuk membantu pusat data mencapai "WUE of 2.0 m3/MWh or lower over the next 10 years", dari median 2,2 m³/MWh pada 2021 untuk pusat data pengguna air besar.

Yang menentukan adalah hubungan kedua target itu dengan alokasi kapasitas. Dokumen itu mengaitkan *Data Centre Call for Application* (DC-CFA) dan alokasi kapasitas mendatang secara tegas dengan efisiensi energi dan energi rendah karbon. Tidak ada kalimat yang mengaitkan alokasi kapasitas dengan target WUE. Untuk air, instrumen yang mengikat hanyalah kewajiban PUB yang sudah ada sebelumnya, yaitu *Mandatory Water Efficiency Management Practices* bagi pengguna air 60.000 m³ per tahun atau lebih, berupa pemasangan meter dan penyampaian rencana efisiensi air. Jadi di Singapura **energi digerbangi, air hanya ditargetkan**.

Operator di Singapura tidak dapat menghindari syarat energi, karena tanpa memenuhinya ia tidak memperoleh kapasitas. Syarat air cukup dipenuhi dengan kepatuhan administratif terhadap PUB. Negara yang sama menghasilkan dua tingkat daya paksa, tergantung apakah kewajiban itu dikaitkan dengan sumber daya langka yang dibutuhkan operator.

Dari perbandingan ketiga yurisdiksi, pengajar menyusun tiga unsur yang harus hadir bersamaan agar kewajiban lingkungan pusat data benar-benar bekerja:

| Unsur | Uni Eropa | Indonesia | Singapura |
|---|---|---|---|
| (a) Pemicu mengikuti beban fisik (daya, air) | Ya untuk pelaporan (500 kW) | Tidak; luas lahan dan bangunan | Ya untuk energi (PUE) |
| (b) Data per fasilitas dapat diuji pihak ketiga | Tidak; publikasi agregat | Secara prinsip melalui partisipasi AMDAL, tetapi tidak ada dokumen yang ditemukan | Tidak diketahui dari sumber yang tersedia |
| (c) Kepatuhan menggerbangi sumber daya langka | Tidak; belum ada standar kinerja | Tidak | Ya untuk energi, tidak untuk air |

Tabel ini sintesis pengajar, sejalan dengan tema jalur Lanjutan ini: norma bekerja bila ada **tuas** yang tidak dapat dihindari sasarannya dan **tangan** yang mampu menariknya. EED punya tangan (Komisi dan Pengadilan UE), tetapi tuasnya baru pelaporan. Singapura punya keduanya untuk energi. Indonesia punya yurisdiksi, tetapi belum punya tuas yang terkait dengan beban.

### 6. Greenwashing Klaim "AI Hijau"

#### 6.1 Bentuk klaim

Klaim lingkungan tentang AI biasanya mengambil tiga pola: angka per kueri yang rendah dengan metode pilihan sendiri ("lima tetes air per prompt"), klaim tren (penurunan jejak 33 kali dalam setahun), dan klaim netralitas yang bersandar pada sertifikat atau offset. Ketiganya tidak otomatis menyesatkan, tetapi menjadi masalah hukum bila metode, batas sistem, atau dasar klaimnya tidak diungkapkan.

Laporan Google di Bagian 1 berguna untuk latihan karena metodenya diungkapkan rinci. WUE kategori 2 berarti konsumsi, bukan pengambilan, dan sebagian penurunan karbonnya berasal dari pengadaan energi bersih berbasis pasar, bukan dari berkurangnya listrik yang dipakai. Metode yang jujur tidak menjamin pembingkaian yang netral.

#### 6.2 Directive (EU) 2024/825

[Directive (EU) 2024/825](https://eur-lex.europa.eu/eli/dir/2024/825/oj/eng) tentang pemberdayaan konsumen untuk transisi hijau (ECGT) mengubah Directive 2005/29/EC tentang praktik komersial tidak adil. Ia menambahkan ke daftar hitam praktik yang selalu dianggap tidak adil, antara lain: klaim lingkungan generik (misalnya *ramah lingkungan* atau *energy efficient*) tanpa bukti kinerja lingkungan unggul yang diakui; klaim bahwa suatu produk netral atau berdampak rendah terhadap emisi gas rumah kaca berdasarkan offset; label keberlanjutan yang tidak didasarkan pada skema sertifikasi atau penetapan otoritas publik; dan klaim kinerja lingkungan di masa depan tanpa rencana pelaksanaan yang rinci, terukur, dan berjangka waktu. Negara anggota wajib mentransposisikannya paling lambat 27 Maret 2026, dan ketentuannya diterapkan mulai 27 September 2026.

Pengajar membaca bahwa klaim "AI netral karbon" yang ditujukan kepada konsumen dan bersandar pada offset berada dalam jangkauan larangan itu. Namun ECGT adalah instrumen perlindungan konsumen, sehingga klaim antarpelaku usaha, misalnya layanan cloud kepada korporasi, kemungkinan berada di luar jangkauannya. Batas ini adalah bahan diskusi, bukan hasil putusan.

Instrumen pelengkapnya, Green Claims Directive yang mewajibkan verifikasi klaim sebelum dipakai, berstatus *Blocked* menurut [Legislative Train Schedule Parlemen Eropa](https://www.europarl.europa.eu/legislative-train/theme-a-european-green-deal/file-substantiating-green-claims) per 1 Agustus 2026, dan belum ditarik secara resmi. Menurut [ulasan CMS](https://cms.law/en/aut/legal-updates/the-eu-green-claims-directive-where-are-we-now-and-what-s-next), ECGT tetap berlaku *no matter what* terjadi pada usulan itu. Akibatnya, Uni Eropa melarang klaim tanpa dasar tetapi belum menetapkan standar pembuktian yang seragam.

#### 6.3 Indonesia

Di Indonesia, belum ada aturan khusus tentang greenwashing, sebagaimana dicatat [SmartLegal](https://smartlegal.id/galeri-hukum/perlindungan-konsumen/2024/12/04/greenwashing-dan-perlindungan-konsumen-sl/). Dasar yang tersedia adalah Pasal 8 ayat (1) huruf f [UU 8/1999 tentang Perlindungan Konsumen](https://peraturan.go.id/id/uu-no-8-tahun-1999), yang melarang pelaku usaha memperdagangkan barang atau jasa yang tidak sesuai dengan janji dalam label, iklan, atau promosi, sebagaimana diuraikan dalam [panduan SIP Law Firm](https://siplawfirm.id/menghindari-risiko-greenwashing-panduan-korporasi-dalam-membuat-klaim-ramah-lingkungan). POJK 51/2017 mewajibkan laporan keberlanjutan, tetapi tidak melarang klaim. Tanpa metode pengukuran yang ditetapkan, hakim tidak punya ukuran untuk menilai kapan "hemat air" *tidak sesuai dengan janji*. Masalah greenwashing kembali ke masalah Bagian 1: tanpa batas sistem yang ditetapkan hukum, kebohongan dan perbedaan metode sulit dibedakan.

---

## C. PENUTUP

### 1. Rangkuman

1. Angka jejak AI berbeda karena batas sistemnya berbeda, dan hampir semuanya laporan diri. Angka vendor harus disajikan bersama metodenya.
2. EED Pasal 12 dan Delegated Regulation 2024/1364 mengikat dan dapat ditegakkan. Kelemahannya publikasi agregat dan ketiadaan standar kinerja, bukan daya ikat.
3. EU AI Act hanya meminta energi model yang "known or estimated" untuk regulator, tanpa batas energi, air, atau publikasi.
4. Indonesia menangkap pusat data dalam Permen LHK 4/2021, tetapi menyaringnya menurut luas; PP 33/2023 dan Permen PUPR 2/2024 diam tentang pusat data.
5. Singapura menggerbangi energi melalui alokasi kapasitas, tetapi hanya menargetkan air.
6. ECGT berlaku mulai 27 September 2026; Indonesia hanya memiliki Pasal 8 UU 8/1999 tanpa standar pembuktian.

### 2. Latihan / Soal Diskusi

1. Sebuah perusahaan mengklaim layanan AI-nya memakai "kurang dari 1 mL air per kueri". Susun daftar pertanyaan yang harus dijawab perusahaan itu sebelum klaim tersebut dapat diuji di hadapan hakim berdasarkan Pasal 8 UU 8/1999.
2. Apakah publikasi agregat dalam Delegated Regulation 2024/1364 dapat dipertahankan terhadap hak atas informasi lingkungan menurut Konvensi Aarhus dan Directive 2003/4/EC? Timbang argumen kerahasiaan komersial dan kepentingan publik.
3. Bila Anda merancang revisi Permen LHK 4/2021, apakah Anda akan menambahkan ambang daya (MW) atau ambang pengambilan air untuk KBLI 63111/63112? Apa risikonya bila angka itu tetap dilaporkan sendiri oleh pemrakarsa?
4. Singapura dapat menggerbangi kapasitas karena listriknya langka dan dikuasai negara. Apakah PLN, sebagai pemasok tunggal sambungan listrik, dapat menjadi "tangan" yang setara di Indonesia? Apa dasar hukumnya, dan apa hambatannya?

**Tugas riset.** Pilih satu proyek pusat data di Indonesia yang diumumkan setelah 2023. Telusuri dokumen publik yang tersedia (KBLI, lokasi kawasan, dokumen lingkungan, izin penggunaan sumber daya air, informasi kapasitas). Tuliskan dalam 3.000 kata: instrumen apa yang berlaku, dokumen apa yang dapat diakses publik, dan pada titik mana beban daya dan air proyek itu diuji atau tidak diuji oleh hukum.

### 3. Studi Kasus: Pusat Data Google di Cerrillos, Chile

Google merencanakan pusat data di Cerrillos, wilayah Santiago yang mengalami kekeringan berkepanjangan. Menurut [tulisan Heinrich Böll Stiftung](https://eu.boell.org/en/2024/04/08/eu-ai-act-missed-opportunity), komunitas setempat menggugat ketertutupan informasi proyek itu di pengadilan sampai memperoleh data yang lebih lengkap, termasuk rencana pemakaian air minum sekitar 7,6 juta liter per hari. Tulisan itu menyebut bahwa pembangunan kemudian ditangguhkan melalui putusan pengadilan lain, dengan merujuk pada pemberitaan bahwa pengadilan lingkungan membatalkan persetujuan proyek. Teks putusan Chile itu sendiri tidak diperiksa dalam korpus riset bab ini, sehingga rincian amar dan pertimbangannya perlu diverifikasi mahasiswa dari sumber primer.

Yang bekerja di sini bukan pelaporan tahunan ala Uni Eropa, melainkan penilaian dampak sebelum izin yang dibuka gugatan masyarakat, dengan air sebagai pokok sengketa.

**Pertanyaan analisis:**

1. Seandainya proyek yang sama diajukan di Indonesia di atas lahan 3 ha dengan bangunan 8.000 m², dokumen lingkungan apa yang wajib menurut Permen LHK 4/2021? Apakah pemakaian air 7,6 juta liter per hari akan diuji dalam dokumen itu?
2. Instrumen apa di Indonesia yang dapat dipakai masyarakat untuk memperoleh angka pengambilan air proyek tersebut? Pertimbangkan UU 32/2009, UU Keterbukaan Informasi Publik, dan perizinan sumber daya air.
3. Bandingkan dengan Singapura: apakah pemakaian air sebesar itu akan menghalangi alokasi kapasitas di sana? Jelaskan dengan membedakan target WUE dan gerbang DC-CFA.

### 4. Agenda Riset

1. **Uji praktik AMDAL pusat data.** Apakah ada pusat data di Indonesia yang telah menyusun AMDAL, UKL-UPL, atau SPPL, dan apakah dokumennya dapat diakses publik? Apakah ada pola desain proyek yang berada tepat di bawah ambang 5 ha atau 10.000 m²? Temuan positif akan mengubah kesimpulan "tertangkap di atas kertas" menjadi "tertangkap dalam praktik"; temuan pola di bawah ambang akan menguatkan kekhawatiran tentang proksi.
2. **Klasifikasi pusat data dalam PP 33/2023.** Apakah Kementerian ESDM telah menerbitkan pedoman yang menggolongkan pusat data sebagai industri atau bangunan gedung? Bila belum, argumen penafsiran mana yang lebih kuat, dan berapa pusat data yang akan terjaring oleh masing-masing tafsir?
3. **Metrik air dalam perizinan sumber daya air.** Dapatkah WUE, atau batas pengambilan per MWh, dimasukkan sebagai syarat dalam izin penggunaan sumber daya air tanpa mengubah undang-undang? Siapa yang berwenang menetapkannya?
4. **Nasib standar JTC 21.** Apakah Spesifikasi Teknis metrik AI berkelanjutan terbit sebelum 2 Agustus 2027? Bila tidak, bagaimana AI Office menilai kepatuhan terhadap kewajiban energi yang "known or estimated"?
5. **Hak atas data per fasilitas.** Apakah Pasal 4(5) Delegated Regulation 2024/1364 dapat diuji terhadap hak atas informasi lingkungan, dan apakah Indonesia, bila kelak mewajibkan pelaporan pusat data, sebaiknya mengulang pilihan agregat itu?
6. **Dampak habitat.** Belum ada kajian empiris tentang dampak pusat data terhadap habitat di Indonesia. Tesis dapat memetakan lokasi pusat data dan kawasan industri yang direncanakan terhadap tekanan air wilayah sungai dan kawasan bernilai konservasi.

### 5. Daftar Pustaka

**Sumber Primer**

- [Directive (EU) 2023/1791 on energy efficiency (EED)](https://eur-lex.europa.eu/eli/dir/2023/1791/oj/eng), terutama Pasal 12 dan Annex VII.
- [Commission Delegated Regulation (EU) 2024/1364](https://eur-lex.europa.eu/eli/reg_del/2024/1364/oj/eng) tentang skema penilaian pusat data.
- [Regulation (EU) 2024/1689 (EU AI Act)](https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng); [Pasal 40](https://artificialintelligenceact.eu/article/40/), [Pasal 53](https://artificialintelligenceact.eu/article/53/), [Annex XI](https://artificialintelligenceact.eu/annex/11/).
- [Directive (EU) 2024/825 (ECGT)](https://eur-lex.europa.eu/eli/dir/2024/825/oj/eng).
- [UU 32/2009 tentang Perlindungan dan Pengelolaan Lingkungan Hidup](https://peraturan.go.id/id/uu-no-32-tahun-2009).
- [UU 8/1999 tentang Perlindungan Konsumen](https://peraturan.go.id/id/uu-no-8-tahun-1999).
- [UU 17/2019 tentang Sumber Daya Air](https://peraturan.go.id/id/uu-no-17-tahun-2019).
- [PP 5/2021 tentang Penyelenggaraan Perizinan Berusaha Berbasis Risiko](https://peraturan.go.id/id/pp-no-5-tahun-2021).
- [PP 22/2021 tentang Penyelenggaraan Perlindungan dan Pengelolaan Lingkungan Hidup](https://peraturan.go.id/id/pp-no-22-tahun-2021).
- [PP 33/2023 tentang Konservasi Energi](https://peraturan.go.id/id/pp-no-33-tahun-2023) ([teks lengkap, JDIH ESDM](https://jdih.esdm.go.id/common/dokumen-external/Peraturan%20Pemerintah%20Nomor%2033%20Tahun%202023.pdf)).
- [PP 70/2009 tentang Konservasi Energi](https://peraturan.go.id/id/pp-no-70-tahun-2009) (dicabut oleh PP 33/2023).
- [PP 71/2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik](https://peraturan.go.id/id/pp-no-71-tahun-2019).
- [Permen LHK 4/2021 tentang Daftar Usaha dan/atau Kegiatan yang Wajib Memiliki AMDAL, UKL-UPL, atau SPPL](https://peraturan.go.id/id/permen-lhk-no-4-tahun-2021).
- [Permen PUPR 2/2024 tentang Tata Cara Perizinan Berusaha Penggunaan Sumber Daya Air dan Persetujuan Penggunaan Sumber Daya Air](https://jdih.pu.go.id/detail-dokumen/PermenPUPR-nomor-2-tahun-2024-Tata-Cara-Perizinan-Berusaha-Penggunaan-Sumber-Daya-Air-dan-Persetujuan-Penggunaan-Sumber-Daya-Air).
- IMDA, [Green Data Centre Roadmap (halaman resmi)](https://www.imda.gov.sg/how-we-can-help/green-dc-roadmap) dan [dokumen Roadmap, Mei 2024](https://www.imda.gov.sg/assets/c99c4fa7-8fe9-4082-9969-1e86f69375e4).
- Pengadilan Uni Eropa, [siaran pers perkara C-121/21 R (Turów)](https://curia.europa.eu/site/upload/docs/application/pdf/2021-09/cp210159en.pdf).
- CEN-CENELEC, [Artificial Intelligence](https://www.cencenelec.eu/areas-of-work/cen-cenelec-topics/artificial-intelligence/); [ikhtisar deliverable JTC 21](https://jtc21.eu/wp-content/uploads/2025/06/CEN-CENELEC-JTC21-AI-Standards-Complete-Detailed-Overview.pdf).
- JRC, [2025 Best Practice Guidelines for the EU Code of Conduct on Data Centre Energy Efficiency](https://publications.jrc.ec.europa.eu/repository/handle/JRC141521).
- Parlemen Eropa, [Legislative Train Schedule: Substantiating green claims](https://www.europarl.europa.eu/legislative-train/theme-a-european-green-deal/file-substantiating-green-claims).

**Sumber Sekunder**

- IEA, [Energy demand from AI](https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai).
- Google, [Measuring the environmental impact of delivering AI at Google scale](https://arxiv.org/abs/2508.15734) (laporan vendor).
- [How Hungry is AI? Benchmarking Energy, Water, and Carbon Footprint of LLM Inference](https://arxiv.org/abs/2505.09598).
- Li, Yang, Islam & Ren, [Making AI Less "Thirsty"](https://arxiv.org/abs/2304.03271).
- [Reconciling the contrasting narratives on the environmental impact of large language models](https://doi.org/10.1038/s41598-024-76682-6), *Scientific Reports*.
- Mistral AI, [Our contribution to a global environmental standard for AI](https://mistral.ai/news/our-contribution-to-a-global-environmental-standard-for-ai) (laporan vendor).
- Chen dkk., [Electricity Demand and Grid Impacts of AI Data Centers](https://arxiv.org/abs/2509.07218).
- Siddik, Shehabi & Marston, [The environmental footprint of data centers in the United States](https://doi.org/10.1088/1748-9326/abfba1).
- White & Case, [Energy efficiency requirements under the EU AI Act](https://www.whitecase.com/insight-alert/energy-efficiency-requirements-under-eu-ai-act).
- Heinrich Böll Stiftung, [The EU AI Act and environmental protection: the case for a missed opportunity](https://eu.boell.org/en/2024/04/08/eu-ai-act-missed-opportunity) (tulisan advokasi).
- Notes from Poland, [EU court rejects Poland's complaint over unpaid coal mine fines](https://notesfrompoland.com/2024/05/30/eu-court-rejects-polands-complaint-over-unpaid-coal-mine-fines/).
- [No End in Sight? A Greenwash Review and Research Agenda](https://doi.org/10.1177/10860266231168905).
- CMS, [The EU Green Claims Directive: where are we now, and what's next?](https://cms.law/en/aut/legal-updates/the-eu-green-claims-directive-where-are-we-now-and-what-s-next).
- Prolegal, [Perizinan Data Center Indonesia](https://prolegal.id/perizinan-data-center-indonesia-bagaimana-perizinannya/).
- BP Lawyers, [Bisnis Data Center Sedang Naik Daun](https://bplawyers.co.id/2025/01/28/bisnis-data-center-sedang-naik-daun-bagaimana-ketentuan-perizinan-dan-kbli-nya/).
- The Conversation Indonesia, [Dampak lingkungan data center tak bisa diremehkan](https://theconversation.com/dampak-lingkungan-data-center-tak-bisa-diremehkan-solusinya-tak-cukup-dengan-efisiensi-energi-203168).
- SmartLegal, [Greenwashing dan Perlindungan Konsumen](https://smartlegal.id/galeri-hukum/perlindungan-konsumen/2024/12/04/greenwashing-dan-perlindungan-konsumen-sl/).
- SIP Law Firm, [Menghindari Risiko Greenwashing](https://siplawfirm.id/menghindari-risiko-greenwashing-panduan-korporasi-dalam-membuat-klaim-ramah-lingkungan).

### 6. Tautan Terkait

- ← [[01-Lingkungan/Lanjutan/BAB 4 -- Kebakaran Hutan dan Lahan --|BAB 4: Kebakaran Hutan dan Lahan]]
- → [[01-Lingkungan/Lanjutan/BAB 6 -- Keanekaragaman Hayati dan Perlindungan Habitat --|BAB 6: Keanekaragaman Hayati dan Perlindungan Habitat]]
- ↑ [[01-Lingkungan/Lanjutan/index|Jalur Lanjutan]]
- Bacaan dasar: [[01-Lingkungan/BAB 5 -- AMDAL dan Perizinan Lingkungan --|BAB 5 buku dasar: AMDAL dan Perizinan Lingkungan]]

---

*Buku Ajar Hukum Lingkungan | BAB 5*
