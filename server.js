#!/usr/bin/env node
/**
 * pan-mcp — MCP server for Indian PAN (Permanent Account Number) validation.
 *
 * Tools:
 *   pan_validate — pure local format + holder-type validation (no key needed)
 *
 * Data source: none — PAN validation is a pure local format algorithm, like the
 * offline validator in gst-mcp's lib/gstin.js. No API key, no network call.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { validatePan } from './lib/pan.js';

const TOOLS = [
  {
    name: 'pan_validate',
    description:
      'Validate an Indian PAN (Permanent Account Number) locally without any API key: ' +
      'checks the 10-character format (5 letters, 4 digits, 1 letter) and the holder-type ' +
      'character. Returns valid/invalid plus parsed fields. Use as a fast pre-check before ' +
      'any income-tax lookup.',
    inputSchema: {
      type: 'object',
      properties: {
        pan: {
          type: 'string',
          description: 'PAN to validate, e.g. ABCPD1234C.',
        },
      },
      required: ['pan'],
    },
  },
];

const server = new Server(
  { name: 'pan-mcp', version: '0.1.0' },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'pan_validate') {
    const raw = args?.pan;
    if (!raw) {
      return {
        content: [{ type: 'text', text: JSON.stringify({ valid: false, error: 'Missing required argument: pan' }) }],
      };
    }
    return {
      content: [{ type: 'text', text: JSON.stringify(validatePan(raw), null, 2) }],
    };
  }

  return {
    error: `Unknown tool: ${name}`,
    content: [{ type: 'text', text: `Unknown tool: ${name}` }],
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('pan-mcp server running on stdio');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
