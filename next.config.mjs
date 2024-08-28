/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        taint: true,
        missingSuspenseWithCSRBailout: false,
    },
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    images:{
        remotePatterns: [
            {
                hostname: "dotoron.com",
            },
            {
                hostname: "avatars.githubusercontent.com",
            }
        ],
    }
};

export default nextConfig;
