/**
 * Simple Router for Worker
 */

export class Router {
  private routes: Map<string, Map<string, (request: Request, env: any, ctx: any) => Promise<Response>>>;

  constructor() {
    this.routes = new Map();
  }

  add(method: string, path: string, handler: (request: Request, env: any, ctx: any) => Promise<Response>) {
    if (!this.routes.has(method)) {
      this.routes.set(method, new Map());
    }
    this.routes.get(method)!.set(path, handler);
  }

  async handle(request: Request, env: any, ctx: any): Promise<Response> {
    const method = request.method;
    const url = new URL(request.url);
    const path = url.pathname;

    const methodRoutes = this.routes.get(method);
    if (!methodRoutes) {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const handler = methodRoutes.get(path);
    if (!handler) {
      return new Response('Not Found', { status: 404 });
    }

    return handler(request, env, ctx);
  }
}
