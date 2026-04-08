import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
