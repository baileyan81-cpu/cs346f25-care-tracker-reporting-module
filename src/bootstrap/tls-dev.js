/**
 * Module: Provides logic for this feature.
 */

// DEV ONLY — enable by setting ALLOW_INSECURE_TLS=1 in your .env or shell.
// This widens the bypass to cover both fetch-based libs and Node's https.
if (process.env.ALLOW_INSECURE_TLS === '1') {
  // 1) Broad process-level toggle (covers code paths that don't use fetch)
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  // 2) Also flip Node's global https agent for good measure
  try {
    const https = require('https');
    if (https?.globalAgent?.options) {
      https.globalAgent.options.rejectUnauthorized = false;
    }
  } catch (_) {}

  // 3) Keep the Undici dispatcher + global fetch for libraries that use fetch
  try {
    const { setGlobalDispatcher, Agent, fetch } = require('undici');
    setGlobalDispatcher(new Agent({ connect: { rejectUnauthorized: false } }));
    global.fetch = fetch;
  } catch (_) {
    // undici not installed — that's ok; steps 1 & 2 still work
  }

  console.warn(
    '[TLS] Insecure TLS bypass ENABLED for dev (ALLOW_INSECURE_TLS=1). Do NOT use in prod.'
  );
}
