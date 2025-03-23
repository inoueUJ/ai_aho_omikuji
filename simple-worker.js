// simple-worker.js - 単純なCloudflare Workerエントリポイント
export default {
  async fetch(request, env, ctx) {
    try {
      // 組み込みのHTTPサーバーを使用
      return await fetch(request);
    } catch (e) {
      return new Response(`Server Error: ${e.message}`, { status: 500 });
    }
  }
};
