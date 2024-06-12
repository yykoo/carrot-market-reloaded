/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns: [
            {
                hostname: "dotoron.com",
            }
        ],
    }
};

export default nextConfig;
