/** @type {import('next').NextConfig} */

const path = require('path');

const allowDomains =
  '*.polygon.io *.alphavantage.co *.googletagmanager.com *.google.com *.gstatic.com *.google-analytics.com *.onetrust.com cdn.cookielaw.org acsbapp.com *.acsbapp.com *.facebook.net *.facebook.com *.sociablekit.com *.cybersource.com *.paydollar.com api.payme.hsbc.com.hk sandbox.api.payme.hsbc.com.hk *.hsbc.com.hk shopfront.paymebiz.hsbc.com.hk *.taboola.com s.yimg.com *.doubleclick.net *.googleapis.com sp.analytics.yahoo.com *.google.com.hk *.appier.net';
const cspHeader = `
  default-src 'self' ${allowDomains};
  script-src 'self' 'unsafe-eval' 'unsafe-inline' ${allowDomains};
  style-src 'self' 'unsafe-inline' ${allowDomains};
  img-src 'self' blob: data: ${allowDomains};
  connect-src 'self' ${allowDomains};
  font-src 'self' data: ${allowDomains};
  object-src 'none';
  frame-src *;
  base-uri 'self';
  form-action 'self' ${allowDomains};
  frame-ancestors *;
  upgrade-insecure-requests;
`;

const nextConfig = {
  trailingSlash: false,
  reactStrictMode: false,
  sassOptions: {
    includePaths: [path.join(__dirname, './src/styles/')],
  },
  images: {
    dangerouslyAllowSVG: true,
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'backend host',
        port: '',
        pathname: '/media/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ];
  },
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: '/:lang',
        destination: '/:lang/stocks/clik',
        permanent: true,
      },
    ];
  },
  output: 'standalone',
};

if (process.env.NODE_ENV === 'production') {
  nextConfig.compiler = {
    removeConsole: process.env.REMOVE_CONSOLE === 'true' ? { exclude: ['error'] } : false,
  };
}

module.exports = nextConfig;
