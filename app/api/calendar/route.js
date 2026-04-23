export async function POST(req) {
  try {
    const { action, payload } = await req.json();

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    const CALENDAR_MCP_AUTH_TOKEN = process.env.CALENDAR_MCP_AUTH_TOKEN;
    const CALENDAR_MCP_URL = process.env.CALENDAR_MCP_URL || 'https://calendarmcp.googleapis.com/mcp/v1';
    const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';
    const TIMEZONE = process.env.APP_TIMEZONE || 'Asia/Karachi';

    if (!ANTHROPIC_API_KEY) {
      return Response.json({ error: 'ANTHROPIC_API_KEY not set in environment' }, { status: 500 });
    }

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const next7 = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    const next30 = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

    let userMsg = '';
    const sys = `You are a calendar assistant. Use Google Calendar tools to help the user. 
Format events clearly: date, time, title, location. Mark [URGENT] if title/desc contains urgent/important/ASAP.
Timezone: ${TIMEZONE}. Be concise and friendly. If no events, say so clearly.`;

    if (action === 'today') {
      userMsg = `Show all my Google Calendar events for today ${today}`;
    } else if (action === 'tomorrow') {
      userMsg = `Show all my Google Calendar events for tomorrow ${tomorrow}`;
    } else if (action === 'week') {
      userMsg = `Show all my Google Calendar events from ${today} to ${next7}`;
    } else if (action === 'urgent_week') {
      userMsg = `Search my Google Calendar for events with 'urgent', 'important', or 'ASAP' in title or description from ${today} to ${next7}`;
    } else if (action === 'urgent_month') {
      userMsg = `Search my Google Calendar for events with 'urgent', 'important', or 'ASAP' in title or description from ${today} to ${next30}`;
    } else if (action === 'add') {
      const { title, date, startTime, endTime, location, description, urgent } = payload;
      const finalTitle = urgent ? `[URGENT] ${title}` : title;
      const finalDesc = urgent ? `⚠️ URGENT MEETING\n\n${description || ''}` : (description || '');
      userMsg = `Create a Google Calendar event:
Title: ${finalTitle}
Date: ${date}
Start time: ${startTime}
End time: ${endTime}
Location: ${location || 'Not specified'}
Description: ${finalDesc}
Timezone: ${TIMEZONE}
Please create this event now and confirm with event details.`;
    } else {
      return Response.json({ error: 'Unknown action' }, { status: 400 });
    }

    const mcpServer = {
      type: 'url',
      url: CALENDAR_MCP_URL,
      name: 'google-calendar',
      tool_configuration: {
        enabled: true,
      },
    };
    if (CALENDAR_MCP_AUTH_TOKEN) {
      mcpServer.authorization_token = CALENDAR_MCP_AUTH_TOKEN;
    }

    const body = {
      model: MODEL,
      max_tokens: 1000,
      system: sys,
      messages: [{ role: 'user', content: userMsg }],
      mcp_servers: [mcpServer],
    };

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'mcp-client-2025-04-04',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json();
      return Response.json({ error: err.error?.message || 'API error' }, { status: res.status });
    }

    const data = await res.json();
    const text = (data.content || [])
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n') || 'Koi response nahi mila.';

    return Response.json({ result: text });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
