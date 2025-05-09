// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, // Or your preferred setting
    // Add the images configuration block:
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com',
          port: '', // Not needed for Google images
          pathname: '/**', // Using a wildcard for pathname is often safest for Google images
        },
        // Add other domains here if you need images from other external sources
      ],
    },
  };
  
  export default nextConfig;