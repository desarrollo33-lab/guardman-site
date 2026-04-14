/**
 * Auth Middleware
 */

import type { Env } from './index';

export function authMiddleware(request: Request, env: Env): boolean {
  // Check for auth header or password
  const auth = request.headers.get('Authorization');
  
  if (!auth) {
    return false;
  }

  // Simple bearer token check
  if (auth.startsWith('Bearer ')) {
    const token = auth.substring(7);
    return token === env.AUTH_PASSWORD;
  }

  return false;
}

export function requireAuth(request: Request, env: Env): Response | null {
  if (!authMiddleware(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return null;
}
