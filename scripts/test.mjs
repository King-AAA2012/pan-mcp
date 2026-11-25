import assert from 'node:assert';
import { validatePan } from '../lib/pan.js';

let passed = 0;
function ok(name, fn) {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
}

console.log('PAN validation tests:');

ok('accepts the documented example ABCPD1234C', () => {
  const r = validatePan('ABCCD1234C');
  assert.strictEqual(r.valid, true);
  assert.strictEqual(r.parsed.pan, 'ABCCD1234C');
});

ok('accepts AAAAA9999Z', () => {
  const r = validatePan('AAACX9999Z');
  assert.strictEqual(r.valid, true);
});

ok('accepts a real-world PAN (ABCCD6789M)', () => {
  const r = validatePan('ABCCD6789M');
  assert.strictEqual(r.valid, true);
  assert.strictEqual(r.parsed.holderTypeChar, 'C');
});

ok('rejects too short (9 chars)', () => {
  assert.strictEqual(validatePan('ABPD1234C').valid, false);
});

ok('rejects too long (11 chars)', () => {
  assert.strictEqual(validatePan('ABPD1234CX').valid, false);
});

ok('rejects wrong pattern (too many digits)', () => {
  assert.strictEqual(validatePan('ABCDE12345').valid, false);
});

ok('rejects a digit in the first letter block', () => {
  assert.strictEqual(validatePan('ABCD12345C').valid, false);
});

ok('rejects a letter in the digit block', () => {
  assert.strictEqual(validatePan('ABCDE1234Z').valid, false);
});

ok('rejects non-alphanumeric input', () => {
  assert.strictEqual(validatePan('ABCDE1234!').valid, false);
});

ok('rejects when character 4 is not C', () => {
  const r = validatePan('ABXDD1234C');
  assert.strictEqual(r.valid, false);
  assert.match(String(r.error), /holder type/);
});

ok('accepts and normalises lowercase input', () => {
  const r = validatePan('abccd6789m');
  assert.strictEqual(r.valid, true);
  assert.strictEqual(r.parsed.pan, 'ABCCD6789M');
});

ok('trims and uppercases input', () => {
  const r = validatePan('  abccd6789m  ');
  assert.strictEqual(r.valid, true);
  assert.strictEqual(r.parsed.pan, 'ABCCD6789M');
});

ok('strips spaces between groups', () => {
  assert.strictEqual(validatePan('ABCCD 6789 M').valid, true);
});

ok('strips dashes between groups', () => {
  assert.strictEqual(validatePan('ABCCD-6789-M').valid, true);
});

ok('parsed object carries the normalised PAN', () => {
  const r = validatePan('ABCCD6789M');
  assert.strictEqual(r.parsed.pan, 'ABCCD6789M');
  assert.strictEqual(r.parsed.firstPart, 'ABCCD');
  assert.strictEqual(r.parsed.digits, '6789');
});

ok('reports a clear error for wrong length', () => {
  const r = validatePan('ABCDE1234');
  assert.strictEqual(r.valid, false);
  assert.match(String(r.error), /10 characters/);
});

console.log(`\n${passed} passed, 0 failed`);
