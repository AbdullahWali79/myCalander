# Calendar Manager — Bot Maker by Abdullah

Google Calendar manager powered by Claude AI + MCP.

## Vercel Deployment (5 minutes)

### Step 1 — GitHub pe upload karo
1. github.com pe new repo banao: `calendar-manager`
2. Ye sari files upload karo (ya git push karo)

### Step 2 — Vercel pe deploy karo
1. vercel.com → New Project → GitHub repo select karo
2. Deploy click karo

### Step 3 — Environment Variables add karo
Vercel Dashboard → Project → Settings → Environment Variables:

**REQUIRED (ye 2 zaroor daalo):**
```
ANTHROPIC_API_KEY = sk-ant-api03-...
CALENDAR_MCP_AUTH_TOKEN = (Google OAuth token - neeche dekho)
```

**OPTIONAL (already code mein hain, change karna ho to daalo):**
```
CALENDAR_MCP_URL = https://calendarmcp.googleapis.com/mcp/v1
CALENDAR_MCP_NAME = google-calendar
APP_TIMEZONE = Asia/Karachi
ANTHROPIC_MODEL = claude-sonnet-4-20250514
```

### CALENDAR_MCP_AUTH_TOKEN kahan se milega?

Ye Google OAuth Bearer token hai jo Google Calendar MCP server authenticate karta hai.

**Option A — Claude.ai se copy karo (Easiest):**
Browser DevTools open karo (F12) jab claude.ai use kar rahe ho → Network tab → 
koi bhi calendar action karo → request mein `authorization_token` value copy karo.

**Option B — Google OAuth directly:**
1. console.cloud.google.com → APIs & Services → Credentials
2. OAuth 2.0 Client ID banao
3. Google Calendar API enable karo
4. OAuth flow se access token lo

## Local Development
```bash
npm install
# .env.local file banao aur variables daalo
npm run dev
```
