import express from "express";
import cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const app = express();
app.use(cors());
app.use(express.json());

function createMcpServer() {
  // MCP サーバーの初期化
  const server = new McpServer({
    name: "sample-streamable-http-mcp-server",
    version: "1.0.0",
  });

  // ツールの定義
  server.tool(
    "calculate_add",
    "2つの数値を加算するツール",
    {
      a: z.number().describe("1つ目の数値"),
      b: z.number().describe("2つ目の数値"),
    },
    async ({ a, b }) => {
      return {
        content: [
          {
            type: "text",
            text: `計算結果: ${a} + ${b} = ${a + b}`,
          },
        ],
      };
    }
  );

  return server;
}

// ステートレスな単一のPOSTエンドポイント
app.post("/mcp", async (req, res) => {
  try {
    // リクエストごとにトランスポートとサーバーを作成
    const transport = new StreamableHTTPServerTransport();
    const server = createMcpServer();

    // 接続のセットアップ
    await server.connect(transport);

    // リクエストの処理とレスポンス送信
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error('Error handling MCP request:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Stateless MCP Server running on http://localhost:${PORT}/mcp`);
});
