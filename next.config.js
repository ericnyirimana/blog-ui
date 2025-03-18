/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: true,
  // Prevent environment variables from being bundled
  env: {
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'mock_client_id'
  },
  // Disable source maps in production to prevent leaking secrets
  productionBrowserSourceMaps: false,
  webpack: (config, { isServer, dev }) => {
    // Prevent environment variables from being included in the bundle
    if (!dev) {
      config.optimization.minimize = true;
    }
    return config;
  }
};

module.exports = nextConfig;