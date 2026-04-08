import type { TOCItemType } from "fumadocs-core/toc";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { Banner } from "fumadocs-ui/components/banner";
import { Callout } from "fumadocs-ui/components/callout";
import { Card, Cards } from "fumadocs-ui/components/card";
import { ServerCodeBlock } from "fumadocs-ui/components/codeblock.rsc";
import { File, Files, Folder } from "fumadocs-ui/components/files";
import { Heading } from "fumadocs-ui/components/heading";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import Image from "next/image";
import Link from "next/link";

import { buildImageUrl } from "./sanity/image";

type MarkDefinition = {
	_key?: string;
	_type?: string;
	href?: string;
};

type Span = {
	_key?: string;
	_type?: "span";
	marks?: string[];
	text?: string;
};

type FileNode = {
	_key?: string;
	children?: FileNode[];
	isFolder?: boolean;
	name?: string;
};

type Block = {
	_key?: string;
	_type?: string;
	alt?: string;
	body?: string;
	caption?: string;
	cards?: { _key?: string; description?: string; href?: string; title?: string }[];
	changeLayout?: boolean;
	children?: Span[];
	code?: string;
	content?: string;
	filename?: string;
	files?: FileNode[];
	height?: number;
	image?: unknown;
	items?: { _key?: string; body?: string; title?: string }[];
	language?: string;
	markDefs?: MarkDefinition[];
	steps?: { _key?: string; body?: string; title?: string }[];
	style?: string;
	tabs?: { _key?: string; body?: string; label?: string }[];
	title?: string;
	tone?: "error" | "idea" | "info" | "success" | "warning";
	variant?: "normal" | "rainbow";
	width?: number;
};

function getText(block: Block) {
	if (!block.children) return "";

	return block.children.map((child) => child.text ?? "").join("");
}

export function extractTableOfContents(value: unknown[]): TOCItemType[] {
	const items: TOCItemType[] = [];

	for (const item of value) {
		const block = item as Block;
		if (block._type !== "block") continue;

		const style = block.style ?? "normal";
		if (!["h2", "h3", "h4"].includes(style)) continue;

		const title = getText(block);
		items.push({
			depth: Number.parseInt(style.slice(1), 10),
			title,
			url: `#${slugify(title)}`,
		});
	}

	return items;
}

export async function PortableTextContent({ value }: { value: unknown[] }) {
	const rendered = await Promise.all(
		value.map(async (entry, index) => renderPortableNode(entry as Block, index)),
	);

	return <>{rendered}</>;
}

async function renderPortableNode(block: Block, index: number) {
	if (block._type === "callout") {
		return (
			<Callout key={block._key ?? index} title={block.title} type={block.tone ?? "info"}>
				{block.body}
			</Callout>
		);
	}

	if (block._type === "codeBlock") {
		return (
			<div key={block._key ?? index} className="my-6">
				<ServerCodeBlock
					code={block.code ?? ""}
					codeblock={{
						title: block.filename,
					}}
					lang={block.language ?? "text"}
				/>
			</div>
		);
	}

	if (block._type === "image") {
		const image = buildImageUrl(block)?.width(1600).url();
		if (!image) return null;

		return (
			<figure
				key={block._key ?? index}
				className="my-8 overflow-hidden border border-[var(--card-border)]"
			>
				<Image
					alt={block.alt ?? ""}
					className="h-auto w-full object-cover"
					height={900}
					src={image}
					width={1600}
				/>
				{block.caption ? (
					<figcaption className="mt-3 text-sm text-[var(--muted-foreground)]">
						{block.caption}
					</figcaption>
				) : null}
			</figure>
		);
	}

	if (block._type === "stepsBlock" && block.steps) {
		return (
			<Steps key={block._key ?? index}>
				{block.steps.map((step, i) => (
					<Step key={step._key ?? i}>
						<h4>{step.title}</h4>
						{step.body ? <p>{step.body}</p> : null}
					</Step>
				))}
			</Steps>
		);
	}

	if (block._type === "tabsBlock" && block.tabs) {
		return (
			<Tabs key={block._key ?? index} items={block.tabs.map((t) => t.label ?? "")}>
				{block.tabs.map((tab, i) => (
					<Tab key={tab._key ?? i} value={tab.label ?? ""}>
						{tab.body ? <p className="leading-7">{tab.body}</p> : null}
					</Tab>
				))}
			</Tabs>
		);
	}

	if (block._type === "accordionBlock" && block.items) {
		return (
			<Accordions key={block._key ?? index} type="single" collapsible>
				{block.items.map((item, i) => (
					<Accordion key={item._key ?? i} title={item.title ?? ""}>
						{item.body ? <p className="leading-7">{item.body}</p> : null}
					</Accordion>
				))}
			</Accordions>
		);
	}

	if (block._type === "cardGrid" && block.cards) {
		return (
			<Cards key={block._key ?? index}>
				{block.cards.map((card, i) => (
					<Card key={card._key ?? i} href={card.href} title={card.title ?? ""}>
						{card.description ?? ""}
					</Card>
				))}
			</Cards>
		);
	}

	if (block._type === "bannerBlock" && block.content) {
		return (
			<Banner
				key={block._key ?? index}
				variant={block.variant === "rainbow" ? "rainbow" : undefined}
				changeLayout={block.changeLayout}
			>
				{block.content}
			</Banner>
		);
	}

	if (block._type === "imageZoom") {
		const image = buildImageUrl(block.image as Record<string, unknown>)
			?.width(block.width ?? 1600)
			.url();
		if (!image) return null;

		return (
			<figure key={block._key ?? index} className="my-8">
				<ImageZoom
					alt={block.alt ?? ""}
					height={block.height ?? 900}
					src={image}
					width={block.width ?? 1600}
				/>
				{block.caption ? (
					<figcaption className="mt-3 text-center text-sm text-[var(--muted-foreground)]">
						{block.caption}
					</figcaption>
				) : null}
			</figure>
		);
	}

	if (block._type === "filesBlock" && block.files) {
		return (
			<Files key={block._key ?? index}>
				{block.files.map((node, i) => renderFileNode(node, i))}
			</Files>
		);
	}

	if (block._type !== "block") return null;

	const text = getText(block);
	const id = slugify(text);

	switch (block.style) {
		case "h2":
		case "h3":
		case "h4":
			return (
				<Heading
					as={block.style}
					className="mt-10 scroll-mt-28 font-[var(--font-heading)]"
					id={id}
					key={block._key ?? index}
				>
					{text}
				</Heading>
			);
		case "blockquote":
			return (
				<blockquote
					className="my-6 border-l-4 border-[var(--brand)]/50 pl-4 italic text-[var(--muted-foreground)]"
					key={block._key ?? index}
				>
					{renderChildren(block)}
				</blockquote>
			);
		default:
			return (
				<p key={block._key ?? index} className="my-5 leading-7 text-[var(--foreground)]/90">
					{renderChildren(block)}
				</p>
			);
	}
}

function renderChildren(block: Block) {
	const definitions = new Map(
		(block.markDefs ?? []).map((definition) => [definition._key, definition]),
	);

	return (block.children ?? []).map((child, index) => {
		let node: React.ReactNode = child.text ?? "";

		for (const mark of child.marks ?? []) {
			if (mark === "strong") {
				node = <strong key={`${child._key ?? index}-${mark}`}>{node}</strong>;
				continue;
			}

			if (mark === "em") {
				node = <em key={`${child._key ?? index}-${mark}`}>{node}</em>;
				continue;
			}

			if (mark === "code") {
				node = (
					<code
						className="border border-[var(--card-border)] bg-[var(--brand-soft)] px-1.5 py-0.5 text-sm"
						key={`${child._key ?? index}-${mark}`}
					>
						{node}
					</code>
				);
				continue;
			}

			const definition = definitions.get(mark);
			if (definition?._type === "link" && definition.href) {
				const isExternal = definition.href.startsWith("http");
				node = (
					<Link
						className="underline decoration-[var(--brand)]/55 underline-offset-4"
						href={definition.href}
						key={`${child._key ?? index}-${mark}`}
						rel={isExternal ? "noopener noreferrer" : undefined}
						target={isExternal ? "_blank" : undefined}
					>
						{node}
					</Link>
				);
			}
		}

		return <span key={child._key ?? index}>{node}</span>;
	});
}

function renderFileNode(node: FileNode, index: number): React.ReactNode {
	if (node.isFolder) {
		return (
			<Folder key={node._key ?? index} name={node.name ?? "folder"}>
				{(node.children ?? []).map((child, i) => renderFileNode(child, i))}
			</Folder>
		);
	}
	return <File key={node._key ?? index} name={node.name ?? "file"} />;
}

function slugify(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}
