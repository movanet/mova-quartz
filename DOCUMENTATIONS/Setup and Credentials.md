# Setup and Credentials

Complete reference for all accounts, credentials, and configuration for the mova-quartz project.

---

## Quick Reference Card

| Service | URL | Credentials |
|---------|-----|-------------|
| **Live Site** | https://note.alafghani.info | Public |
| **Protected Content** | https://note.alafghani.info/perubahan-iklim/ | `fhuika` / `fhuika2026` |
| **Netlify Dashboard** | https://app.netlify.com/projects/mova-quartz | Netlify account |
| **GitHub Repo** | https://github.com/movanet/mova-quartz | `movanet` account |

---

## Account Information

### GitHub

| Field | Value |
|-------|-------|
| **Repository** | https://github.com/movanet/mova-quartz |
| **Username** | movanet |
| **Branch** | v4 |
| **Clone URL** | `https://github.com/movanet/mova-quartz.git` |

### Netlify

| Field | Value |
|-------|-------|
| **Site Name** | mova-quartz |
| **Site ID** | `1c671d6b-34fe-4905-9c1c-59ff4166e37a` |
| **Netlify URL** | https://mova-quartz.netlify.app |
| **Custom Domain** | https://note.alafghani.info |
| **Dashboard** | https://app.netlify.com/projects/mova-quartz |
| **Account ID** | `640ec635dcf746089c4b2c08` |
| **User ID** | `640ec635dcf746089c4b2c07` |
| **Functions Region** | us-east-2 |

---

## API Credentials

### Netlify API Token (Personal Access Token)

| Field | Value |
|-------|-------|
| **Token** | `nfp_r33PYc8YVTqs3NkVvcmH6LWCgrTG2sdd4815` |
| **Created** | 2026-01-05 |
| **Purpose** | Claude Code / API access for mova-quartz |
| **Permissions** | Full API access |

**Usage:**
```bash
# Set as environment variable
export NETLIFY_TOKEN="nfp_r33PYc8YVTqs3NkVvcmH6LWCgrTG2sdd4815"

# Use in API calls
curl -H "Authorization: Bearer $NETLIFY_TOKEN" \
  https://api.netlify.com/api/v1/sites/mova-quartz.netlify.app

# Or inline
curl -H "Authorization: Bearer nfp_r33PYc8YVTqs3NkVvcmH6LWCgrTG2sdd4815" \
  https://api.netlify.com/api/v1/sites/mova-quartz.netlify.app
```

**Generate New Token:**
1. Go to: https://app.netlify.com/user/applications
2. Navigate to **Personal access tokens**
3. Click **New access token**
4. Set name and expiration
5. Click **Generate token**
6. **Copy immediately** (won't be shown again!)

> **Security:** This token grants full API access. Do not commit to public repos or share publicly.

See full API documentation: [Netlify-API-Reference.md](./Netlify-API-Reference.md)

---

## Protected Content Authentication

The `/perubahan-iklim/` path uses HTTP Basic Auth via Netlify Edge Functions.

### Default Credentials

| Field | Value |
|-------|-------|
| **Protected Path** | `/perubahan-iklim/*` |
| **Username** | `fhuika` |
| **Password** | `fhuika2026` |
| **Auth Type** | HTTP Basic Auth |
| **Edge Function** | `netlify/edge-functions/auth.ts` |

### Test Access

```bash
# Without auth (returns 401 Unauthorized)
curl -I https://note.alafghani.info/perubahan-iklim/

# With auth (returns 200 OK)
curl -I -u fhuika:fhuika2026 https://note.alafghani.info/perubahan-iklim/

# Full content with auth
curl -u fhuika:fhuika2026 https://note.alafghani.info/perubahan-iklim/
```

### Override via Environment Variables

To change credentials without editing code, set in Netlify Dashboard:

1. Go to: https://app.netlify.com/projects/mova-quartz/configuration/env
2. Add variables:
   - `AUTH_USERNAME` - New username
   - `AUTH_PASSWORD` - New password
3. Redeploy for changes to take effect

**Edge Function Code (reference):**
```typescript
const VALID_USERNAME = Deno.env.get("AUTH_USERNAME") || "fhuika";
const VALID_PASSWORD = Deno.env.get("AUTH_PASSWORD") || "fhuika2026";
```

---

## Local Paths

### Windows Paths

| Item | Path |
|------|------|
| Vault / Quartz repo | `C:\Users\mova\obsidian\mova-quartz` |
| Content folder | `C:\Users\mova\obsidian\mova-quartz\content` |
| Protected content | `C:\Users\mova\obsidian\mova-quartz\content\perubahan-iklim` |
| Quartz config | `C:\Users\mova\obsidian\mova-quartz\quartz.config.ts` |
| Netlify config | `C:\Users\mova\obsidian\mova-quartz\netlify.toml` |
| Edge functions | `C:\Users\mova\obsidian\mova-quartz\netlify\edge-functions` |
| Plugin folder | `C:\Users\mova\obsidian\mova-quartz\.obsidian\plugins\quartz-publisher` |
| Documentation | `C:\Users\mova\obsidian\mova-quartz\DOCUMENTATIONS` |
| Build output | `C:\Users\mova\obsidian\mova-quartz\public` |

### Credential Storage Locations

| Credential Type | Storage Location |
|-----------------|------------------|
| Git credentials | Windows Credential Manager |
| Netlify CLI auth | `~/.netlify/config.json` |
| SSH keys (if used) | `~/.ssh/` |

---

## Environment Requirements

| Tool | Required Version | Check Command |
|------|------------------|---------------|
| Node.js | 22+ | `node --version` |
| npm | 10+ | `npm --version` |
| Git | Any recent | `git --version` |
| Netlify CLI | Latest | `npx netlify-cli --version` |

### Install Requirements

```bash
# Install Node.js 22+ from https://nodejs.org/

# Verify installation
node --version   # Should show v22.x.x
npm --version    # Should show 10.x.x

# Netlify CLI (installed on demand via npx)
npx netlify-cli --version
```

---

## Authentication Commands

### Check Git Authentication

```bash
cd C:\Users\mova\obsidian\mova-quartz

# Check remote URL
git remote -v
# Should show: origin  https://github.com/movanet/mova-quartz.git (fetch/push)

# Check current branch
git branch
# Should show: * v4

# Test push access
git push origin v4 --dry-run
```

### Check Netlify Authentication

```bash
cd C:\Users\mova\obsidian\mova-quartz

# Check status
npx netlify-cli status
```

Expected output:
```
──────────────────────┐
 Current Netlify User │
──────────────────────┘
Email: movanet@gmail.com
Teams:
  - movanet

────────────────────┐
 Netlify Project Info  │
────────────────────┘
Current project: mova-quartz
Netlify TOML:    C:\Users\mova\obsidian\mova-quartz\netlify.toml
Admin URL:       https://app.netlify.com/projects/mova-quartz
Project URL:     https://note.alafghani.info
Project Id:      1c671d6b-34fe-4905-9c1c-59ff4166e37a
```

### Re-authenticate Services

**Netlify:**
```bash
npx netlify-cli logout
npx netlify-cli login
# Follow browser prompt to authenticate
```

**Git (if credentials expired):**
```bash
# Windows will prompt for credentials on next push
git push origin v4
# Enter GitHub username and PAT when prompted
```

### Re-link Netlify Site

```bash
cd C:\Users\mova\obsidian\mova-quartz
npx netlify-cli unlink
npx netlify-cli link
# Select "mova-quartz" from the list
```

---

## Initial Setup (New Machine)

If setting up on a new machine, follow these steps:

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

### 3. Install plugin dependencies (optional)

```bash
cd .obsidian/plugins/quartz-publisher
npm install
npm run build
cd ../../..
```

### 4. Link Netlify

```bash
npx netlify-cli login
# Follow browser prompt

npx netlify-cli link
# Select "mova-quartz" from list
```

### 5. Verify setup

```bash
# Check Netlify status
npx netlify-cli status

# Test local build
npx quartz build --serve
# Open http://localhost:8080
```

### 6. Open in Obsidian

1. Open Obsidian
2. "Open folder as vault"
3. Select `C:\Users\mova\obsidian\mova-quartz`
4. Settings → Community Plugins → Enable "Quartz Publisher"

---

## Netlify Environment Variables

Set in Netlify Dashboard → Site Settings → Environment Variables:

| Variable | Purpose | Default | Context |
|----------|---------|---------|---------|
| `AUTH_USERNAME` | Protected content username | `fhuika` | All |
| `AUTH_PASSWORD` | Protected content password | `fhuika2026` | All |
| `NODE_VERSION` | Node.js version for builds | `22` | All |

### How to Set

1. Go to: https://app.netlify.com/projects/mova-quartz/configuration/env
2. Click "Add a variable"
3. Enter key and value
4. Select context (usually "All")
5. Save
6. Redeploy for changes to take effect

---

## Security Notes

### What's Stored Where

| Secret | Location | Security |
|--------|----------|----------|
| Git credentials | Windows Credential Manager | OS-protected |
| Netlify CLI token | `~/.netlify/config.json` | User-only access |
| Netlify API token | This documentation | Do not commit to public repos |
| Protected content password | Edge function + Netlify env vars | Not in public code |

### What's NOT in the Repository

- No API tokens in committed code
- No passwords in committed code (only fallback defaults in edge function)
- `.obsidian` folder is gitignored (except plugin files)
- `public/` build output is gitignored
- `node_modules/` is gitignored

### Rotating Credentials

**Netlify API Token:**
1. Go to: https://app.netlify.com/user/applications
2. Revoke old token
3. Generate new token
4. Update this documentation

**Protected Content Password:**
1. Go to: https://app.netlify.com/projects/mova-quartz/configuration/env
2. Update `AUTH_PASSWORD`
3. Redeploy

**Git Credentials:**
1. Windows Credential Manager → Remove GitHub credential
2. Next git push will prompt for new credentials

---

## Backup Information

| Item | Backed Up To | Recovery |
|------|--------------|----------|
| Source notes | GitHub (movanet/mova-quartz) | `git clone` |
| Published content | GitHub + Netlify CDN | `git clone` + `npx quartz build` |
| Plugin code | GitHub (in .obsidian/plugins) | `git clone` |
| Obsidian settings | Local only | Manual backup needed |
| This documentation | GitHub | `git clone` |

### Disaster Recovery

If all local data is lost:

```bash
# 1. Clone from GitHub
git clone https://github.com/movanet/mova-quartz.git
cd mova-quartz
git checkout v4

# 2. Install dependencies
npm install

# 3. Re-link Netlify
npx netlify-cli login
npx netlify-cli link

# 4. Verify
npx quartz build --serve
```

---

## Related Documentation

- [CLAUDE.md](../CLAUDE.md) - Main project guide
- [Quartz Configuration](./Quartz%20Configuration.md) - Quartz settings
- [Quartz Publisher Plugin](./Quartz%20Publisher%20Plugin.md) - Obsidian plugin
- [Netlify API Reference](./Netlify-API-Reference.md) - API documentation
