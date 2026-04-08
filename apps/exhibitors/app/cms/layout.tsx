export default function StudioLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div className="h-dvh overflow-hidden bg-[#111318]">{children}</div>;
}
