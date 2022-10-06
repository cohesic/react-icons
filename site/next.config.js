/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/react-icons',
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    externalDir: true,
  },
}

module.exports = nextConfig
