import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	devIndicators: false,
	images: {
		remotePatterns: [
			{
				hostname: "cdn.sanity.io",
				protocol: "https",
			},
		],
	},
	transpilePackages: ["@hof/sanity"],
	turbopack: {
		root: path.join(__dirname, "../.."),
	},
};

export default nextConfig;
