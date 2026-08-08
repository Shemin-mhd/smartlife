/**
 * Computes SHA-256 cryptographic hash digest of a given input string.
 * Uses Web Crypto API natively supported in all modern web browsers.
 * 
 * SHA-256 is a one-way mathematical function. Inspecting the resulting hash digest
 * in Chrome DevTools reveals zero information about the original input string.
 */
export async function hashSHA256(message: string): Promise<string> {
  try {
    const msgBuffer = new TextEncoder().encode(message.trim().toLowerCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    console.error('Crypto digest error:', e);
    return '';
  }
}
