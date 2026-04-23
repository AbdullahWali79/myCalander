# My Calendar Manager

Vercel-ready calendar app with:

- Static front-end in [`index.html`](./index.html)
- Server-side Vercel Functions in [`api/calendar.js`](./api/calendar.js) and [`api/status.js`](./api/status.js)
- Anthropic Messages API + remote MCP server support

## Required environment variables

Set these in Vercel Project Settings -> Environment Variables:

- `ANTHROPIC_API_KEY`
- `CALENDAR_MCP_AUTH_TOKEN` from your calendar MCP provider or OAuth flow

Optional:

- `CALENDAR_MCP_URL` default: `https://calendarmcp.googleapis.com/mcp/v1`
- `CALENDAR_MCP_NAME` default: `google-calendar`
- `APP_TIMEZONE` default: `Asia/Karachi`
- `ANTHROPIC_MODEL` default: `claude-sonnet-4-20250514`

You can copy the template from [`.env.example`](./.env.example).

## Important note

If your calendar MCP server uses OAuth, `CALENDAR_MCP_AUTH_TOKEN` must be obtained and refreshed by you or your provider. This repo does not implement the OAuth flow itself.

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the repo into Vercel.
3. Add the environment variables listed above.
4. Redeploy.

The app no longer stores API keys in the browser. Secrets stay on the server and the front-end talks to `/api/calendar`.
