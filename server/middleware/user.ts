import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  try {
    const user = await serverSupabaseUser(event);
    event.context.user = user ?? null;
  } catch (err) {
    // When no session is present, @supabase/auth-js can throw
    // "Auth session is missing". Treat as unauthenticated instead
    // of failing the request.
    event.context.user = null;
  }
});
