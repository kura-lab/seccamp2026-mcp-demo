# Seccamp 2026 MCP Demo

MCP demo apps before MCP OAuth

## How to run locally

### Prerequisite

* npm 12.0.2
* node v26.7.0

### Install

```shell
npm i
```

### Start the MCP Server and Client

#### stdio

```shell
npm run start:stdio:client
```

#### HTTP with SSE(Server-Sent Events)

```shell
# Terminal 1
npm run start:sse:server
```

```shell
# Terminal 2
npm run start:sse:client
```
