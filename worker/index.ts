/**
 * Guardman Agent - Worker Principal
 */

import { handleResearch, handleBatchResearch } from './handlers/research';
import { handleGenerate } from './handlers/generate';
import { handleD1Status, handleD1Query } from './handlers/d1';
import { handleGuardmanAgent } from './handlers/guardman';
import { handleDeploy } from './handlers/deploy';
import { handleSections } from './handlers/sections-api';

export { GuardmanAgent } from './agents/guardman';

export interface Env {
  DB: D1Database;
  AI: any;
  GUARDMAN: DurableObjectNamespace;
  AUTH_PASSWORD: string;
  ENVIRONMENT: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Health check
    if (path === '/health') {
      return new Response(JSON.stringify({
        status: 'ok',
        service: 'guardman-agent',
        timestamp: new Date().toISOString()
      }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    let response: Response;

    try {
      if (path === '/') {
        response = new Response(JSON.stringify({
          service: 'Guardman Agent',
          version: '1.0.0',
          endpoints: {
            research: '/api/research',
            generate: '/api/generate',
            d1: '/api/d1/status',
            guardman: '/api/guardman/status',
            deploy: '/api/deploy'
          }
        }), { headers: { 'Content-Type': 'application/json' } });

      } else if (path === '/api/research') {
        response = await handleResearch(request, env);
        
      } else if (path === '/api/batch-research') {
        response = await handleBatchResearch(request, env);
        
      } else if (path.startsWith('/api/generate')) {
        response = await handleGenerate(request, env, ctx);
        
      } else if (path === '/api/d1/status' || path === '/api/d1/query') {
        response = await handleD1Query(request, env);
        
      } else if (path.startsWith('/api/guardman')) {
        response = await handleGuardmanAgent(request, env, ctx);
        
      } else if (path === '/api/deploy') {
        response = await handleDeploy(request, env, ctx);
        
      } else if (path.startsWith('/api/sections')) {
        response = await handleSections(request, env, ctx);
        
      } else {
        response = new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

    } catch (error: any) {
      console.error('Worker error:', error);
      response = new Response(JSON.stringify({
        error: 'Internal server error',
        message: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Add CORS headers
    const headers = new Headers(response.headers);
    for (const [key, value] of Object.entries(corsHeaders)) {
      headers.set(key, value);
    }

    return new Response(response.body, {
      status: response.status,
      headers
    });
  }
};
