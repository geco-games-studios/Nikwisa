import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http", // or "https" if applicable
        hostname: "localhost",
        port: "8000", // Ensure this matches your backend port
        pathname: "/media/**", // Restrict to the media folder
      },
    ],
  },
};

export default nextConfig;

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     domains: ["fast-fortress-74085-34676c20f85e.herokuapp.com", "localhost"], // Add the external domain here
//   },
// };

// export default nextConfig;
