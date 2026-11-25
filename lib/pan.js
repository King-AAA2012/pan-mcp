/**
 * Offline PAN (Permanent Account Number) validation.
 *
 * A PAN is 10 characters: AAAAA9999C
 *   1–5  First part — 5 letters (always alphabetic)
 *   6–9  Second part — 4 digits
 *   10   Third part — 1 letter (holder type encoded in chars 4–5)
 *
 * Rules enforced here:
 *   - Pattern is /^[A-Z]{5}[0-9]{4}[A-Z]$/
 *   - The 3rd character is always a letter (part of the 5-letter first block)
 *   - The 4th character is always the letter 'C' (holder type)
 *
 * This module validates format with no network call and no API key.
 *
 * Reference: https://www.incometax.gov.in/inspre/about-pan.html
 *            https://en.wikipedia.org/wiki/Permanent_Account_Number
 */

/**
 * Validate a PAN offline (format + holder-type check).
 *
 * @param {string} pan
 * @returns {{ valid: boolean, error?: string, parsed?: object }}
 */
function validatePan(pan) {
  if (typeof pan !== 'string') {
    return { valid: false, error: 'PAN must be a string' };
  }

  // Normalise: trim whitespace, drop spaces/dashes between groups, uppercase.
  const p = pan.trim().replace(/[\s-]/g, '').toUpperCase();

  if (p.length !== 10) {
    return { valid: false, error: 'PAN must be exactly 10 characters' };
  }
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(p)) {
    return {
      valid: false,
      error: 'PAN must be 5 letters, 4 digits, then 1 letter (e.g. ABCPD1234C)',
    };
  }

  // The 4th character encodes the holder type and is always the letter 'C'.
  if (p[3] !== 'C') {
    return { valid: false, error: 'Character 4 must be the letter C (holder type)' };
  }

  return {
    valid: true,
    parsed: {
      pan: p,
      firstPart: p.slice(0, 5),
      digits: p.slice(5, 9),
      lastChar: p[9],
      holderTypeChar: p[3],
    },
  };
}

export { validatePan };
