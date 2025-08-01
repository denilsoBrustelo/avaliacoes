/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para Docker
  output: 'standalone',

  // Configuração de imagens
  images: {
    domains: ['cdn.builder.io', 'localhost'],
    unoptimized: process.env.NODE_ENV === 'development'
  },

  // Configuração de CORS para desenvolvimento
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  }
}

module.exports = nextConfig
