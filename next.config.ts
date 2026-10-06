import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: "10mb",
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "pub-d6cae836e48e4f28a3cd8a7aff1fbe5d.r2.dev",
            },
        ],
    },
    outputFileTracingIncludes: {
        "**/*": [
            "./node_modules/pg-cloudflare/dist/**",
            "./node_modules/pg-cloudflare/esm/**",
        ],
    },
};

export default nextConfig;
