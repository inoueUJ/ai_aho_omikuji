// worker.js - Cloudflare Worker entry point
import { Server } from '@cloudflare/workers-types';

// Next.jsハンドラーをインポート
import nextServer from './.next/server/app/page.js';

// ESモジュール形式のWorkerとしてエクスポート
export default {
  async fetch(request, env, ctx) {
    try {
      // Next.jsアプリケーションを処理
      return await nextServer.fetch(request, env, ctx);
    } catch (e) {
      return new Response(`Server Error: ${e.message}`, { status: 500 });
    }
  }
} as Server;
