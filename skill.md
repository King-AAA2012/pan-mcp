---
name: pan-mcp
version: 0.1.0
description: MCP server for Indian PAN (Permanent Account Number) validation. Lets Claude and other AI tools validate a PAN's format locally, offline, without an API key.
author: King-AAA2012
license: MIT
---

# pan-mcp â€” Skill

A single MCP (Model Context Protocol) server for Indian data. It lets Claude
Desktop, Claude Code, Cline, or any other MCP client call tools backed by real
Indian data.


## Tools

  | `pan_validate` | Pure local format + holder-type validation. Works offline, no key. | No |

## Requirements
- **Node.js 18+
No API key is required â€” the package works fully offline.

## How to Install / Run

```bash
npm install
node server.js      # boots the MCP server over stdio
```

### Register with an MCP client

Add a server entry to your MCP client config JSON:

```json
{
  "mcpServers": {
    "pan-mcp": {
      "command": "node",
      "args": ["C:/Users/Aditya Shah/Desktop/Code/pan-mcp/server.js"]
    }
  }
}
```

## How to Verify (Tests)

```bash
npm test
```

## Selling / Redistributing

This skill is provided under MIT, so it may be sold or redistributed. Ship it
as its own zip (pan-mcp-0.1.0.zip) in the packages/ folder alongside the other
india-mcp packages.

