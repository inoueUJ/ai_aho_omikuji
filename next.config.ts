import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: process.cwd(),
  // Cloudflare向けの設定
  serverExternalPackages: ['@opentelemetry/api'],
  // Node.js組み込みモジュールを外部依存として扱う
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        'bufferutil',
        'utf-8-validate',
        'async_hooks',
        'crypto',
        'path',
        'stream',
        'url',
        'util',
        'fs',
        'os'
      ];
    }
    return config;
  },
};

export default nextConfig;
