import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

async function main() {
  // 1. Streamable HTTP トランスポートを作成（MCPサーバーの/mcpエンドポイントを指定）
  const transport = new StreamableHTTPClientTransport(
    new URL("http://localhost:3000/mcp")
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

  try {
    // 3. サーバーに接続
    await client.connect(transport);
    console.log('Connected to MCP server via Streamable HTTP...');

    // 4. ツール一覧の取得
    const tools = await client.listTools();
    console.log('Available tools:', JSON.stringify(tools, null, 2));

    // 5. ツールの実行
    console.log("--- Executing Tool: calculate_add ---");
    const callResult = await client.callTool({
      name: "calculate_add",
      arguments: {
        a: 100,
        b: 250,
      },
    });

    console.log("Response:", JSON.stringify(callResult, null, 2));

  } catch (error) {
    console.error('Error in MCP client:', error);
  } finally {
    // 6. セッションのクローズ
    await client.close();
    console.log('Connection closed.');
  }
}

main();
