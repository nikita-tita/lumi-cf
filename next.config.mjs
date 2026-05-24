/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "export",
  trailingSlash: false,
  images: { unoptimized: true },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
