import bundleAnalyzer from "@next/bundle-analyzer";
import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({
  // eslint-disable-next-line n/prefer-global/process
  enabled: process.env.ANALYZE === "true",
});

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
});

const nextConfig: NextConfig = {
  output: "export",
  experimental: {
    reactCompiler: true,
  },
};

export default [withBundleAnalyzer, withSerwist].reduce(
  (config, withFn) => withFn(config),
  nextConfig,
);
