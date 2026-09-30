// Optional public configuration. No password or service_role key belongs here.
export async function loadAuthConfig() {
  const env = import.meta.env || {};
  let config = {};
  try {
    const response = await fetch((env.BASE_URL || './') + 'auth-config.json', { cache: 'no-store', signal: AbortSignal.timeout(8000) });
    if (response.ok) config = await response.json();
  } catch { /* Guest learning is always available. */ }
  return { url: env.VITE_SUPABASE_URL || config.supabaseUrl || '', key: env.VITE_SUPABASE_ANON_KEY || config.supabasePublicKey || '' };
}
