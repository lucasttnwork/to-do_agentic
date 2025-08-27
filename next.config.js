/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações para melhorar a hidratação
  experimental: {
    // Melhorar a hidratação
    optimizePackageImports: ['framer-motion'],
    // Suporte a streaming (migrado para serverExternalPackages)
  },
  // Pacotes externos disponíveis para Server Components
  serverExternalPackages: ['@supabase/supabase-js'],
  
  // Configurações de compilação
  compiler: {
    // Remover console.log em produção
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Configurações de imagens
  images: {
    domains: [],
    unoptimized: false,
  },
  
  // Configurações de webpack
  webpack: (config, { isServer }) => {
    // Otimizações para o cliente
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
  
  // Configurações de headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Configurações de redirecionamento
  async redirects() {
    return [];
  },
  
  // Configurações de rewrites
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
