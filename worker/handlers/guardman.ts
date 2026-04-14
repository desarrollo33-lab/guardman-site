/**
 * Guardman Agent Handler - Routing to Durable Object
 */

import type { Env } from '../index';

export async function handleGuardmanAgent(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const url = new URL(request.url);
  const subPath = url.pathname.replace('/api/guardman', '') || '/status';

  // Get the Durable Object
  const id = env.GUARDMAN.idFromName('guardman');
  const stub = env.GUARDMAN.get(id);

  // Create request to DO
  const doUrl = new URL(subPath, 'https://do');
  if (url.search) doUrl.search = url.search;

  const doRequest = new Request(doUrl.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.body
  });

  return stub.fetch(doRequest);
}
