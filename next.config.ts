import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Workers向けの設定
  output: 'export', // 静的エクスポートモードに変更
  outputFileTracingRoot: process.cwd(),
  // モジュール解決の問題を防ぐ
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // 外部モジュールを明示的に除外
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(config.externals || []), 
        'bufferutil', 
        'utf-8-validate',
        '@opentelemetry/api' // エラーメッセージで示されたモジュール
      ];
    }
    return config;
  },
};

export default nextConfig;
