/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para export estático (GitHub Pages)
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // Otimizações para desenvolvimento
  experimental: {
    optimizeCss: false, // Desabilita otimização de CSS durante desenvolvimento
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Configurações para melhorar HMR
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
}

module.exports = nextConfig
