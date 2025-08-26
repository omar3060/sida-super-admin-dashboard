const nextConfig = {
  // basePath: "/",
  output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;
