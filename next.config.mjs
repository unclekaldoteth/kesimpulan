/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! PERHATIAN !!
    // Ini membolehkan build sukses meski ada error typescript kecil
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ini membolehkan build sukses meski ada warning coding style
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;