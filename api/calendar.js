const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-sonnet-4-20250514";
const DEFAULT_MCP_URL = "https://calendarmcp.googleapis.com/mcp/v1";
const DEFAULT_MCP_NAME = "google-calendar";

function getConfig() {
  return {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || "",
    model: process.env.ANTHROPIC_MODEL || DEFAULT_MODEL,
    mcpUrl: process.env.CALENDAR_MCP_URL || DEFAULT_MCP_URL,
    mcpName: process.env.CALENDAR_MCP_NAME || DEFAULT_MCP_NAME,
    mcpAuthToken: process.env.CALENDAR_MCP_AUTH_TOKEN || "",
    timezone: process.env.APP_TIMEZONE || "Asia/Karachi"
  };
}

function extractText(content) {
  if (!Array.isArray(content)) {
    return "";
  }

  const textBlocks = content
    .filter((block) => block && block.type === "text" && typeof block.text === "string")
    .map((block) => block.text.trim())
    .filter(Boolean);

  if (textBlocks.length > 0) {
    return textBlocks.join("\n\n");
  }

  const toolResultText = content
    .filter((block) => block && block.type === "mcp_tool_result" && Array.isArray(block.content))
    .flatMap((block) => block.content)
    .filter((item) => item && item.type === "text" && typeof item.text === "string")
    .map((item) => item.text.trim())
    .filter(Boolean);

  if (toolResultText.length > 0) {
    return toolResultText.join("\n\n");
  }

  return "";
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { anthropicApiKey, model, mcpUrl, mcpName, mcpAuthToken, timezone } = getConfig();

  if (!anthropicApiKey) {
    res.status(500).json({ error: "Missing ANTHROPIC_API_KEY environment variable." });
    return;
  }

  if (!mcpAuthToken) {
    res.status(500).json({ error: "Missing CALENDAR_MCP_AUTH_TOKEN environment variable." });
    return;
  }

  let body = req.body;

  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (parseError) {
      res.status(400).json({ error: "Request body must be valid JSON." });
      return;
    }
  }

  const systemPrompt = typeof body?.systemPrompt === "string" ? body.systemPrompt.trim() : "";
  const userMessage = typeof body?.userMessage === "string" ? body.userMessage.trim() : "";

  if (!systemPrompt || !userMessage) {
    res.status(400).json({ error: "systemPrompt and userMessage are required." });
    return;
  }

  const requestBody = {
    model,
    max_tokens: 1000,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: userMessage + "\n\nDefault timezone: " + timezone
      }
    ],
    mcp_servers: [
      {
        type: "url",
        url: mcpUrl,
        name: mcpName,
        authorization_token: mcpAuthToken
      }
    ],
    tools: [
      {
        type: "mcp_toolset",
        mcp_server_name: mcpName
      }
    ]
  };

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "mcp-client-2025-11-20"
      },
      body: JSON.stringify(requestBody)
    });

    const raw = await response.text();
    let data;

    try {
      data = JSON.parse(raw);
    } catch (parseError) {
      data = null;
    }

    if (!response.ok) {
      const message = data && data.error && data.error.message ? data.error.message : raw || "Anthropic API request failed.";
      res.status(response.status).json({ error: message });
      return;
    }

    const text = extractText(data && data.content);

    if (!text) {
      res.status(502).json({ error: "Anthropic response did not include a text result." });
      return;
    }

    res.status(200).json({ text });
  } catch (error) {
    res.status(500).json({ error: error.message || "Unexpected server error." });
  }
};
