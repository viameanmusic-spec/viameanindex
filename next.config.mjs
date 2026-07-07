/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5gb",
    },
  },
  // API rotalarının (businesses.js / route.ts) ham haldeki büyük dosyaları 
  // takılmadan kabul etmesini sağlayan ana ayar:
  api: {
    bodyParser: false,
  },
};

export default nextConfig;
