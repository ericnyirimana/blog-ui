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
  // Optimize build performance and memory usage
  webpack: (config, { isServer }) => {
    // Optimize chunk size
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 90000,
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            reuseExistingChunk: true,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name: 'npm',
            chunks: 'all',
            minChunks: 1,
            reuseExistingChunk: true,
            enforce: true,
            priority: 1,
          },
        },
      },
    };

    // Reduce the number of pages being generated in parallel
    if (isServer) {
      config.parallelism = 1;
    }

    return config;
  },
  // Other optimizations
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  swcMinify: true,
};

module.exports = nextConfig;