/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')(
  // Specify the path to your i18n configuration
  {
    locales: ['en', 'sk'],
    defaultLocale: 'en'
  }
);

const nextConfig = {
  reactStrictMode: true,
}

module.exports = withNextIntl(nextConfig);
