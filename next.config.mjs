/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    optimizeCss: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
};

export default nextConfig;
