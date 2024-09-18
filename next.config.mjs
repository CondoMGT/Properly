/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.reca.ca"
      },
      {
        protocol: "https",
        hostname: "www.cpomanagement.ca"
      }
    ]
  }
};

export default nextConfig;
