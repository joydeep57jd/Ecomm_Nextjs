import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qalibrary.uvanij.com",
        port: "",
        pathname: "/**"
      }
    ]
  }
}

export default nextConfig
