import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  // 1. サブプロセスとして MCP サーバーを起動する Stdio トランスポートを設定
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", "src/stdio/server.ts"],
  });

  // 2. Client インスタンスの生成
  const client = new Client(
    {
      name: "sample-mcp-client",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  console.log("Connecting to MCP Server...");
  await client.connect(transport);
  console.log("Connected successfully!\n");

  // 3. サーバーで利用可能なツール一覧を取得
  const toolsResponse = await client.listTools();
  console.log("--- Available Tools ---");
  toolsResponse.tools.forEach((tool) => {
    console.log(`- ${tool.name}: ${tool.description}`);
  });
  console.log("");

  // 4. ツールの実行 (calculate_add)
  console.log("--- Executing Tool: calculate_add ---");
  const callResult = await client.callTool({
    name: "calculate_add",
    arguments: {
      a: 15,
      b: 27,
    },
  });

  console.log("Response:", JSON.stringify(callResult, null, 2));

  // 5. 接続の終了
  await client.close();
}

main().catch((err) => {
  console.error("Client Error:", err);
  process.exit(1);
});
