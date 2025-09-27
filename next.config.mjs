/** @type {import('next').NextConfig} */
const nextConfig = {
    // 关闭严格模式
    reactStrictMode: false,
    // 配置图片来源 - 仅允许可信域名
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'liuyuyang.net',
            },
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'img.shields.io',
            }
        ],
    },
    eslint: {
        // 启用 ESLint 构建时检查，提高代码质量
        ignoreDuringBuilds: false,
    },
};

export default nextConfig;