import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

async function main() {
  // 1. HTTP SSE トランスポートの初期化
  const transport = new SSEClientTransport(
    new URL("http://localhost:3000/sse")
  );

  // 2. Client インスタンスの生成
  const client = new Client(
    {
      name: "sample-http-mcp-client",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  console.log("Connecting to HTTP MCP Server...");
  await client.connect(transport);
  console.log("Connected successfully!\n");

  // 3. ツール一覧の取得
  const toolsResponse = await client.listTools();
  console.log("--- Available Tools ---");
  toolsResponse.tools.forEach((tool) => {
    console.log(`- ${tool.name}: ${tool.description}`);
  });
  console.log("");

  // 4. ツールの実行
  console.log("--- Executing Tool: calculate_add ---");
  const callResult = await client.callTool({
    name: "calculate_add",
    arguments: {
      a: 100,
      b: 250,
    },
  });

  console.log("Response:", JSON.stringify(callResult, null, 2));

  // 5. セッションのクローズ
  await client.close();
}

main().catch((err) => {
  console.error("Client Error:", err);
  process.exit(1);
});
