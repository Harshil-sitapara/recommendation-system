/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "**", // Allow any hostname
      },
    ],
  },
};

export default nextConfig;
