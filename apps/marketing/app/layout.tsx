import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

const brownPro = localFont({
	src: [
		{ path: "../../../packages/fonts/src/BrownPro-Regular.woff2", weight: "400", style: "normal" },
		{ path: "../../../packages/fonts/src/BrownPro-BoldAlt.woff2", weight: "700", style: "normal" },
		{
			path: "../../../packages/fonts/src/BrownPro-BoldItalic.woff2",
			weight: "700",
			style: "italic",
		},
	],
	variable: "--font-body",
	display: "swap",
});

const brownStd = localFont({
	src: [
		{
			path: "../../../packages/fonts/src/BrownStd-ReclinBold.woff2",
			weight: "700",
			style: "normal",
		},
	],
	variable: "--font-heading",
	display: "swap",
});

export const metadata: Metadata = {
	description: "Hall of Flowers marketing site and Sanity Studio owner app.",
	title: "Hall of Flowers",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html className={`${brownPro.variable} ${brownStd.variable}`} lang="en">
			<body className="min-h-screen font-[var(--font-body)] antialiased">{children}</body>
		</html>
	);
}
