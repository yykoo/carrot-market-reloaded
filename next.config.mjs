/** @type {import('next').NextConfig} */
const nextConfig = {
    experimential: {
        taint: true
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
