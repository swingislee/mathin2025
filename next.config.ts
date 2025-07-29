import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '', // 可选，留空表示默认端口
        pathname: '/**', // 匹配所有路径
      },
      {
        protocol: 'http',
        hostname: '192.168.2.213',
        pathname: '/**',
      }
    ],
  },

};

export default nextConfig;
