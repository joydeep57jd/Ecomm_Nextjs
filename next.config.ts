import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qalibrary.uvanij.com",
        port: "", // leave empty unless you have a specific port
        pathname: "/company/consas/images/Item/Original/**", // allow all images under this path
      },
    ],
  },
}

export default nextConfig
