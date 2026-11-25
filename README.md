# pan-mcp

A [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server for **Indian PAN (Permanent Account Number) validation**. It lets Claude Code, Claude Desktop, Cline, and any other MCP client validate a PAN's format locally, offline, without an API key.

A PAN is the 10-character tax ID issued by India's Income Tax Department — e.g. `ABCCX1234C`. This server fills a real gap: there are few MCP servers for Indian data, and PAN verification is high-intent for AI coding and research agents.

## What it does

One tool:

| Tool | Description | Needs API key? |
| --- | --- | --- |
| `pan_validate` | Pure local format + holder-type validation. Works offline, no key. | No |

`pan_validate` is fully offline — it checks the PAN structure and the holder-type character with no network call, so it always works.

## Quick start

```bash
npm install
npm start
```

That starts the server on stdio (the default transport, recommended for local use). Point your MCP client at it:

```json
{
  "mcpServers": {
    "pan": {
      "command": "node",
      "args": ["C:/Users/Aditya Shah/Desktop/Code/pan-mcp/server.js"]
    }
  }
}
```

> Tip: on Windows, write the absolute path with forward slashes (`C:/...`) or quote it.

### Using it in Claude Code / Claude Desktop

Once connected, you can ask things like:

- *"Is `ABCCX1234C` a valid PAN?"* → uses `pan_validate`
- *"Validate this PAN: `ABCD1234C`"* → uses `pan_validate`

## Examples

### pan_validate

```json
{ "name": "pan_validate", "arguments": { "pan": "ABCCX1234C" } }
```

```json
{
  "valid": true,
  "parsed": {
    "pan": "ABCCX1234C",
    "firstPart": "ABCCX",
    "digits": "1234",
    "lastChar": "C",
    "holderTypeChar": "C"
  }
}
```

The validator is strict: it rejects wrong lengths, non-alphanumeric input, a digit in the first letter block, a letter in the digit block, and a 4th character that isn't `C`. It also normalizes input — lowercase, and spaces or dashes between groups like `ABCDE-6789-M` are accepted.

## How the validator works

A PAN has the structure `AAAAA9999C`:

```
AAAAA   5 letters (always alphabetic)
9999    4 digits
C       1 letter — the 4th character is always 'C', encoding the holder type
```

- **Pattern** — must match `/^[A-Z]{5}[0-9]{4}[A-Z]$/` (10 characters total).
- **Character 4** — the holder-type position; it is always the letter `C`.
- **Normalization** — input is trimmed, uppercased, and grouped spaces/dashes are stripped before validation.

There is **no checksum** for a PAN — the format and holder-type rules above are the whole validation.

## Data source & licensing

There is **no data source** — PAN validation is a pure local format algorithm, so no API key and no network call are needed. This project is licensed MIT.

## Development

```bash
npm test          # unit tests for the validator
npm start         # run the MCP server on stdio
```

The tests cover accepted PANs, wrong length, wrong pattern, and trim/lowercase/uppercase normalization.

## Project layout

```
pan-mcp/
├── server.js            # MCP server: tool handlers + transport
├── lib/
│   └── pan.js           # Offline validation
├── scripts/
│   └── test.mjs         # Unit tests (npm test)
├── .gitignore
└── package.json
```
