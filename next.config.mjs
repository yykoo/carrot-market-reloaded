/** @type {import('next').NextConfig} */
const nextConfig = {
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
