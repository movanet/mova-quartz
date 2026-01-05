# Netlify API Reference

Complete API documentation for programmatic interaction with Netlify for the mova-quartz site.

---

## Quick Reference

| Field | Value |
|-------|-------|
| **API Base URL** | `https://api.netlify.com/api/v1/` |
| **API Token** | `nfp_r33PYc8YVTqs3NkVvcmH6LWCgrTG2sdd4815` |
| **Site ID** | `1c671d6b-34fe-4905-9c1c-59ff4166e37a` |
| **Site Name** | `mova-quartz.netlify.app` |
| **Custom Domain** | `note.alafghani.info` |
| **Account ID** | `640ec635dcf746089c4b2c08` |
| **User ID** | `640ec635dcf746089c4b2c07` |

---

## Authentication

### Personal Access Token (PAT)

All API requests require authentication via Bearer token:

```bash
Authorization: Bearer nfp_r33PYc8YVTqs3NkVvcmH6LWCgrTG2sdd4815
```

### Setting Up Environment Variable

```bash
# Set token as environment variable
export NETLIFY_TOKEN="nfp_r33PYc8YVTqs3NkVvcmH6LWCgrTG2sdd4815"

# Use in API calls
curl -H "Authorization: Bearer $NETLIFY_TOKEN" \
  https://api.netlify.com/api/v1/sites
```

### Generate New Token

1. Go to: https://app.netlify.com/user/applications
2. Navigate to **Personal access tokens**
3. Click **New access token**
4. Set name (e.g., "Claude Code API") and expiration
5. Click **Generate token**
6. **Copy immediately** (won't be shown again!)

> **Security:** This token grants full API access to your Netlify account. Keep it secure.

---

## Site Information

### mova-quartz Site Details

| Field | Value |
|-------|-------|
| **Site Name** | mova-quartz |
| **Site ID** | `1c671d6b-34fe-4905-9c1c-59ff4166e37a` |
| **Netlify URL** | https://mova-quartz.netlify.app |
| **Custom Domain** | https://note.alafghani.info |
| **Account ID** | `640ec635dcf746089c4b2c08` |
| **User ID** | `640ec635dcf746089c4b2c07` |
| **Functions Region** | us-east-2 |
| **Dashboard** | https://app.netlify.com/projects/mova-quartz |
| **Deploy Branch** | v4 |

### Get Site Info

```bash
curl -s -H "Authorization: Bearer $NETLIFY_TOKEN" \
  "https://api.netlify.com/api/v1/sites/mova-quartz.netlify.app" | jq '.'
```

---

## Common API Operations

### List All Sites

```bash
curl -s -H "Authorization: Bearer $NETLIFY_TOKEN" \
  "https://api.netlify.com/api/v1/sites" | jq '.[].name'
```

### Get Site Details

```bash
# By site name
curl -s -H "Authorization: Bearer $NETLIFY_TOKEN" \
  "https://api.netlify.com/api/v1/sites/mova-quartz.netlify.app"

# By site ID
curl -s -H "Authorization: Bearer $NETLIFY_TOKEN" \
  "https://api.netlify.com/api/v1/sites/1c671d6b-34fe-4905-9c1c-59ff4166e37a"
```

### List Recent Deploys

```bash
curl -s -H "Authorization: Bearer $NETLIFY_TOKEN" \
  "https://api.netlify.com/api/v1/sites/mova-quartz.netlify.app/deploys?per_page=5" | \
  jq '.[] | {id, state, created_at, deploy_time}'
```

### Get Deploy Status

```bash
# Get latest deploy
curl -s -H "Authorization: Bearer $NETLIFY_TOKEN" \
  "https://api.netlify.com/api/v1/sites/mova-quartz.netlify.app/deploys?per_page=1" | \
  jq '.[0] | {id, state, created_at, error_message}'

# Get specific deploy by ID
curl -s -H "Authorization: Bearer $NETLIFY_TOKEN" \
  "https://api.netlify.com/api/v1/deploys/{deploy_id}"
```

### Trigger New Build

```bash
curl -X POST -H "Authorization: Bearer $NETLIFY_TOKEN" \
  "https://api.netlify.com/api/v1/sites/mova-quartz.netlify.app/builds"
```

---

## Deploy Endpoints

### List Deploys

```
GET /sites/{site_id}/deploys
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `per_page` | integer | Results per page (max 100) |
| `page` | integer | Page number |
| `state` | string | Filter by state (building, ready, error) |

**Example:**
```bash
curl -s -H "Authorization: Bearer $NETLIFY_TOKEN" \
  "https://api.netlify.com/api/v1/sites/mova-quartz.netlify.app/deploys?per_page=10&state=ready"
```

### Get Deploy

```
GET /deploys/{deploy_id}
```

**Example:**
```bash
curl -s -H "Authorization: Bearer $NETLIFY_TOKEN" \
  "https://api.netlify.com/api/v1/deploys/695b2c0bba8ac7f963bda4eb"
```

### Create Deploy (via file digest)

```
POST /sites/{site_id}/deploys
Content-Type: application/json

{
  "files": {
    "/index.html": "sha1_hash_of_file",
    "/css/style.css": "sha1_hash_of_file"
  }
}
```

### Deploy ZIP File

```bash
curl -X POST \
  -H "Authorization: Bearer $NETLIFY_TOKEN" \
  -H "Content-Type: application/zip" \
  --data-binary @site.zip \
  "https://api.netlify.com/api/v1/sites/mova-quartz.netlify.app/deploys"
```

---

## Build Endpoints

### Trigger Build

```
POST /sites/{site_id}/builds
```

**Example:**
```bash
curl -X POST -H "Authorization: Bearer $NETLIFY_TOKEN" \
  "https://api.netlify.com/api/v1/sites/mova-quartz.netlify.app/builds"
```

**Response:**
```json
{
  "id": "build_id",
  "deploy_id": "deploy_id",
  "done": false,
  "error": null,
  "created_at": "2026-01-05T03:12:11.218Z"
}
```

### List Builds

```
GET /sites/{site_id}/builds
```

---

## Environment Variables

### List Environment Variables

```bash
curl -s -H "Authorization: Bearer $NETLIFY_TOKEN" \
  "https://api.netlify.com/api/v1/accounts/640ec635dcf746089c4b2c08/env" | jq '.'
```

### Create Environment Variable

```bash
curl -X POST \
  -H "Authorization: Bearer $NETLIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[{
    "key": "MY_VAR",
    "values": [{
      "value": "my-value",
      "context": "all"
    }]
  }]' \
  "https://api.netlify.com/api/v1/accounts/640ec635dcf746089c4b2c08/env"
```

### Context Values

| Context | Description |
|---------|-------------|
| `all` | All deploy contexts |
| `production` | Production deploys only |
| `deploy-preview` | Deploy previews only |
| `branch-deploy` | Branch deploys only |
| `dev` | Local development only |

---

## Build Hooks

Webhook URLs to trigger builds from external services.

### Create Build Hook

```bash
curl -X POST \
  -H "Authorization: Bearer $NETLIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "GitHub Action Hook",
    "branch": "v4"
  }' \
  "https://api.netlify.com/api/v1/sites/mova-quartz.netlify.app/build_hooks"
```

### Trigger via Build Hook

```bash
# No authentication needed - uses the hook URL
curl -X POST "https://api.netlify.com/build_hooks/{hook_id}"
```

### List Build Hooks

```bash
curl -s -H "Authorization: Bearer $NETLIFY_TOKEN" \
  "https://api.netlify.com/api/v1/sites/mova-quartz.netlify.app/build_hooks"
```

---

## Useful Scripts

### Check Latest Deploy Status

```bash
#!/bin/bash
NETLIFY_TOKEN="nfp_r33PYc8YVTqs3NkVvcmH6LWCgrTG2sdd4815"
SITE_ID="mova-quartz.netlify.app"

curl -s -H "Authorization: Bearer $NETLIFY_TOKEN" \
  "https://api.netlify.com/api/v1/sites/$SITE_ID/deploys?per_page=1" | \
  jq '.[0] | {
    id: .id,
    state: .state,
    created_at: .created_at,
    deploy_time: .deploy_time,
    error: .error_message
  }'
```

### Wait for Deploy to Complete

```bash
#!/bin/bash
NETLIFY_TOKEN="nfp_r33PYc8YVTqs3NkVvcmH6LWCgrTG2sdd4815"
DEPLOY_ID="$1"

while true; do
  STATE=$(curl -s -H "Authorization: Bearer $NETLIFY_TOKEN" \
    "https://api.netlify.com/api/v1/deploys/$DEPLOY_ID" | jq -r '.state')

  echo "Deploy state: $STATE"

  if [ "$STATE" = "ready" ]; then
    echo "Deploy complete!"
    break
  elif [ "$STATE" = "error" ]; then
    echo "Deploy failed!"
    break
  fi

  sleep 5
done
```

### Trigger Build and Monitor

```bash
#!/bin/bash
NETLIFY_TOKEN="nfp_r33PYc8YVTqs3NkVvcmH6LWCgrTG2sdd4815"
SITE_ID="mova-quartz.netlify.app"

# Trigger build
RESULT=$(curl -s -X POST -H "Authorization: Bearer $NETLIFY_TOKEN" \
  "https://api.netlify.com/api/v1/sites/$SITE_ID/builds")

DEPLOY_ID=$(echo $RESULT | jq -r '.deploy_id')
echo "Build triggered. Deploy ID: $DEPLOY_ID"

# Monitor
while true; do
  STATE=$(curl -s -H "Authorization: Bearer $NETLIFY_TOKEN" \
    "https://api.netlify.com/api/v1/deploys/$DEPLOY_ID" | jq -r '.state')

  echo "$(date): State = $STATE"

  if [ "$STATE" = "ready" ] || [ "$STATE" = "error" ]; then
    break
  fi

  sleep 10
done

echo "Final state: $STATE"
```

---

## Rate Limits

| Operation | Limit |
|-----------|-------|
| General API requests | 500/minute |
| Deploys | 3/minute, 100/day |
| Pagination | Max 100 items/page |

### Check Rate Limit Status

Response headers include:
- `X-RateLimit-Limit` - Maximum requests allowed
- `X-RateLimit-Remaining` - Requests remaining
- `X-RateLimit-Reset` - Unix timestamp when limit resets

```bash
curl -I -H "Authorization: Bearer $NETLIFY_TOKEN" \
  "https://api.netlify.com/api/v1/sites" 2>&1 | grep -i ratelimit
```

---

## Pagination

For endpoints returning lists:

```bash
# First page
curl -s -H "Authorization: Bearer $NETLIFY_TOKEN" \
  "https://api.netlify.com/api/v1/sites/mova-quartz.netlify.app/deploys?page=1&per_page=50"

# Check Link header for navigation
curl -I -H "Authorization: Bearer $NETLIFY_TOKEN" \
  "https://api.netlify.com/api/v1/sites/mova-quartz.netlify.app/deploys?per_page=10" 2>&1 | \
  grep -i "^link:"
```

**Link header format:**
```
Link: <...?page=2>; rel="next", <...?page=5>; rel="last"
```

---

## Deploy States

| State | Description |
|-------|-------------|
| `new` | Deploy just created |
| `pending_review` | Awaiting review (if enabled) |
| `accepted` | Review approved |
| `building` | Build in progress |
| `uploading` | Files being uploaded |
| `uploaded` | Upload complete |
| `preparing` | Preparing for publish |
| `prepared` | Ready to publish |
| `processing` | Post-processing |
| `ready` | Deploy live |
| `error` | Deploy failed |
| `skipped` | Deploy skipped |

---

## API Clients

### Official Libraries

- **JavaScript Client:** https://github.com/netlify/js-client
- **Go Client:** https://github.com/netlify/open-api/tree/master/go

### JavaScript Example

```bash
npm install netlify
```

```javascript
const NetlifyAPI = require('netlify');

const client = new NetlifyAPI('nfp_r33PYc8YVTqs3NkVvcmH6LWCgrTG2sdd4815');

// List sites
const sites = await client.listSites();

// Get specific site
const site = await client.getSite({ site_id: 'mova-quartz.netlify.app' });

// List deploys
const deploys = await client.listSiteDeploys({
  site_id: '1c671d6b-34fe-4905-9c1c-59ff4166e37a'
});

// Trigger build
const build = await client.createSiteBuild({
  site_id: '1c671d6b-34fe-4905-9c1c-59ff4166e37a'
});
```

### Netlify CLI API Access

```bash
# Use CLI's built-in API wrapper
npx netlify-cli api listSiteDeploys \
  --data '{"site_id":"1c671d6b-34fe-4905-9c1c-59ff4166e37a"}'

# Get site info
npx netlify-cli api getSite \
  --data '{"site_id":"mova-quartz.netlify.app"}'
```

---

## Troubleshooting

### 401 Unauthorized

**Causes:**
- Token is invalid or expired
- Missing `Bearer` prefix
- Token doesn't have required permissions

**Solutions:**
1. Check token is correct
2. Ensure format is `Authorization: Bearer TOKEN`
3. Generate new token if expired

### 404 Not Found

**Causes:**
- Invalid site_id or deploy_id
- No access to the resource

**Solutions:**
1. Verify site_id: `mova-quartz.netlify.app` or `1c671d6b-34fe-4905-9c1c-59ff4166e37a`
2. Check you're using the correct endpoint

### 429 Too Many Requests

**Causes:**
- Rate limit exceeded

**Solutions:**
1. Wait for rate limit reset (check `X-RateLimit-Reset` header)
2. Reduce request frequency
3. Implement exponential backoff

### Build Failing

Check deploy details for error:

```bash
curl -s -H "Authorization: Bearer $NETLIFY_TOKEN" \
  "https://api.netlify.com/api/v1/deploys/{deploy_id}" | \
  jq '{state, error_message}'
```

---

## OpenAPI Reference

Full API specification:
- https://open-api.netlify.com/

---

## Related Documentation

- [CLAUDE.md](../CLAUDE.md) - Main project guide
- [Setup and Credentials](./Setup%20and%20Credentials.md) - Account info
- [Quartz Configuration](./Quartz%20Configuration.md) - Quartz settings
- [Quartz Publisher Plugin](./Quartz%20Publisher%20Plugin.md) - Obsidian plugin
- [Netlify Official Docs](https://docs.netlify.com/api/get-started/)
