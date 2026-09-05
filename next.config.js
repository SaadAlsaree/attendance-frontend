/** @type {import('next').NextConfig} */
const nextConfig = {
  // No `output: 'standalone'`. The app is deployed with `npm run start` on the
  // frontend server, which reads .env from the project directory. The standalone
  // bundle does not carry .env, so serving it would leave API_URL unset and
  // getServerApiUrl() would throw on every server-side request.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      }
    ]
  },
  transpilePackages: ['geist']
};

module.exports = nextConfig;
