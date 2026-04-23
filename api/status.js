const DEFAULT_MCP_URL = "https://calendarmcp.googleapis.com/mcp/v1";
const DEFAULT_MCP_NAME = "google-calendar";

function getStatus() {
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY || "";
  const mcpAuthToken = process.env.CALENDAR_MCP_AUTH_TOKEN || "";
  const mcpUrl = process.env.CALENDAR_MCP_URL || DEFAULT_MCP_URL;
  const mcpName = process.env.CALENDAR_MCP_NAME || DEFAULT_MCP_NAME;
  const timezone = process.env.APP_TIMEZONE || "Asia/Karachi";

  const missing = [];

  if (!anthropicApiKey) {
    missing.push("ANTHROPIC_API_KEY");
  }

  if (!mcpAuthToken) {
    missing.push("CALENDAR_MCP_AUTH_TOKEN");
  }

  return {
    configured: missing.length === 0,
    missing,
    mcpUrl,
    mcpName,
    timezone
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const status = getStatus();

  if (status.configured) {
    res.status(200).json({
      configured: true,
      timezone: status.timezone,
      mcpName: status.mcpName,
      mcpUrl: status.mcpUrl,
      message: "Backend ready. Server-side secrets configured."
    });
    return;
  }

  res.status(200).json({
    configured: false,
    timezone: status.timezone,
    mcpName: status.mcpName,
    mcpUrl: status.mcpUrl,
    message: "Missing env vars: " + status.missing.join(", ")
  });
};
