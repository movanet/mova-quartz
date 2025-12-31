# Setup and Credentials

## Account Information

### GitHub
- **Repository:** https://github.com/movanet/mova-quartz
- **Branch:** v4
- **Username:** movanet

### Netlify
- **Site:** mova-quartz
- **URL:** https://mova-quartz.netlify.app
- **Dashboard:** https://app.netlify.com/projects/mova-quartz
- **Account ID:** 640ec635dcf746089c4b2c08

---

## Local Paths

| Item | Path |
|------|------|
| Vault / Quartz repo | `C:\Users\mova\obsidian\mova-quartz` |
| Content folder | `C:\Users\mova\obsidian\mova-quartz\content` |
| Plugin folder | `C:\Users\mova\obsidian\mova-quartz\.obsidian\plugins\quartz-publisher` |
| Quartz config | `C:\Users\mova\obsidian\mova-quartz\quartz.config.ts` |
| Netlify config | `C:\Users\mova\obsidian\mova-quartz\netlify.toml` |

---

## Authentication Commands

### Check Git Status
```bash
cd C:\Users\mova\obsidian\mova-quartz
git remote -v
# Should show: origin  https://github.com/movanet/mova-quartz.git
```

### Check Netlify Status
```bash
npx netlify-cli status
```

Expected output:
```
──────────────────────┐
 Current Netlify User │
──────────────────────┘
Email: <your-email>
Teams:
  - <team-name>

────────────────────┐
 Netlify Site Info  │
────────────────────┘
Site ID: ...
Site Name: mova-quartz
```

### Re-authenticate Netlify
```bash
npx netlify-cli logout
npx netlify-cli login
```

### Re-link Netlify Site
```bash
cd C:\Users\mova\obsidian\mova-quartz
npx netlify-cli unlink
npx netlify-cli link
# Select "mova-quartz" from the list
```

---

## Initial Setup (Reference)

If setting up on a new machine:

### 1. Clone the repository
```bash
cd C:\Users\mova\obsidian
git clone https://github.com/movanet/mova-quartz.git
cd mova-quartz
git checkout v4
```

### 2. Install dependencies
```bash
npm install
```

### 3. Install plugin dependencies
```bash
cd .obsidian/plugins/quartz-publisher
npm install
npm run build
```

### 4. Link Netlify
```bash
cd C:\Users\mova\obsidian\mova-quartz
npx netlify-cli login
npx netlify-cli link
```

### 5. Open in Obsidian
Open Obsidian → Open folder as vault → Select `mova-quartz`

### 6. Enable plugin
Settings → Community plugins → Enable "Quartz Publisher"

---

## Environment Requirements

| Tool | Version | Check Command |
|------|---------|---------------|
| Node.js | 22+ | `node --version` |
| npm | 10+ | `npm --version` |
| Git | Any | `git --version` |
| Netlify CLI | Latest | `npx netlify-cli --version` |

---

## Security Notes

- Git credentials are stored in Windows Credential Manager
- Netlify auth token is stored in user profile (`~/.netlify/config.json`)
- No secrets are stored in the repository
- The `.obsidian` folder is gitignored except for necessary plugin files

---

## Backup Locations

| Item | Backed Up To |
|------|--------------|
| Source notes | GitHub (movanet/mova-quartz) |
| Published content | GitHub + Netlify CDN |
| Plugin code | GitHub (in .obsidian/plugins) |
| Obsidian settings | Local only (.obsidian folder) |
