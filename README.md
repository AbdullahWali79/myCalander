# My Calendar Manager

Vercel-ready calendar app with:

- Static front-end in [`index.html`](./index.html)
- Server-side Vercel Functions in [`api/calendar.js`](./api/calendar.js) and [`api/status.js`](./api/status.js)
- Anthropic Messages API + CalendarMCP support

## Required environment variables

Set these in Vercel Project Settings -> Environment Variables:

- `ANTHROPIC_API_KEY`
- `CALENDAR_MCP_AUTH_TOKEN` from your CalendarMCP dashboard API key

Optional:

- `CALENDAR_MCP_URL` default: `https://calendarmcp.ai/api/mcp`
- `CALENDAR_MCP_NAME` default: `google-calendar`
- `APP_TIMEZONE` default: `Asia/Karachi`
- `ANTHROPIC_MODEL` default: `claude-sonnet-4-20250514`

You can copy the template from [`.env.example`](./.env.example).

## Get the keys

1. Create `ANTHROPIC_API_KEY` from [Anthropic Console](https://console.anthropic.com/settings/keys).
2. Open [CalendarMCP docs](https://calendarmcp.ai/docs) and go to `calendarmcp.ai`.
3. Connect your Google Calendar there.
4. Copy your dashboard API key and save it as `CALENDAR_MCP_AUTH_TOKEN`.

## Important note

This repo is now configured to use CalendarMCP by default. If you stay on that provider, you usually do not need to set `CALENDAR_MCP_URL` manually.

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the repo into Vercel.
3. Add at least `ANTHROPIC_API_KEY` and `CALENDAR_MCP_AUTH_TOKEN`.
4. Redeploy.

The app no longer stores API keys in the browser. Secrets stay on the server and the front-end talks to `/api/calendar`.
