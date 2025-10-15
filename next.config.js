/** @type {import('next').NextConfig} */
const nextConfig = {
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
