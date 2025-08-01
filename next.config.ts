import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.2.213:3000'],

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
  reactStrictMode: false, // 禁用 React Strict Mode
};

export default nextConfig;
