import express from "express";
import cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";

const app = express();
app.use(cors());

// MCP サーバーの初期化
const server = new McpServer({
  name: "sample-http-mcp-server",
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

let transport: SSEServerTransport | null = null;

// 1. SSE エンドポイント (サーバーからのイベントストリーム確立)
app.get("/sse", async (req, res) => {
  transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);

  req.on("close", () => {
    console.log("SSE Client disconnected");
  });
});

// 2. HTTP POST エンドポイント (クライアントからの JSON-RPC リクエスト受信)
app.post("/messages", async (req, res) => {
  if (!transport) {
    res.status(400).send("No active SSE connection");
    return;
  }
  await transport.handlePostMessage(req, res);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`MCP HTTP/SSE Server running on http://localhost:${PORT}`);
  console.log(`SSE Endpoint: http://localhost:${PORT}/sse`);
});
