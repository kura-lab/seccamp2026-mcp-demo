import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// MCP サーバーのインスタンス化
const server = new McpServer({
  name: "sample-mcp-server",
  version: "1.0.0",
});

// --- 1. ツールの登録 (Tools) ---
server.tool(
  "calculate_add",
  "2つの数値を加算するツール",
  {
    a: z.number().describe("1つ目の数値"),
    b: z.number().describe("2つ目の数値"),
  },
  async ({ a, b }) => {
    const result = a + b;
    return {
      content: [
        {
          type: "text",
          text: `計算結果: ${a} + ${b} = ${result}`,
        },
      ],
    };
  }
);

// --- 2. リソースの登録 (Resources) ---
server.resource(
  "system-info",
  "info://system",
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        text: JSON.stringify({
          status: "ok",
          uptime: process.uptime(),
          nodeVersion: process.version,
        }),
      },
    ],
  })
);

// --- 3. Stdio トランスポートでサーバー起動 ---
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio...");
}

main().catch((error) => {
  console.error("Server start error:", error);
  process.exit(1);
});
