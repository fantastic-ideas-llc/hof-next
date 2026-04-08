import type {
	BoothTypePage,
	Conference,
	ConferenceSearchMatches,
	ConferenceSummary,
	ExhibitorDocPage,
	ExhibitorDocSummary,
	FaqPage,
	FaqSummary,
} from "@hof/sanity";

const activeConference: Conference = {
	_id: "conference-nyc-fall-2026",
	contacts: [
		{
			_id: "staff-exhibitor-sales",
			email: "eric@hallofflowers.com",
			name: "Eric Bello",
			roles: ["Exhibitor Sales"],
		},
		{
			_id: "staff-exhibitor-onboarding",
			email: "kelsey@hallofflowers.com",
			name: "Kelsey Castro",
			roles: ["Exhibitor Onboarding"],
		},
	],
	description: [
		{
			_key: "conf-desc",
			_type: "block",
			children: [
				{
					_key: "conf-desc-child",
					_type: "span",
					marks: [],
					text: "Use this sample conference to finish the scaffold before the live Sanity project is connected.",
				},
			],
			markDefs: [],
			style: "normal",
		},
	],
	endDate: "2026-09-12T22:00:00.000Z",
	name: "Hall of Flowers NYC Fall 2026",
	slug: "nyc-fall-2026",
	startDate: "2026-09-10T16:00:00.000Z",
	status: "active",
	venue: {
		address: "429 11th Ave",
		city: "New York",
		mapUrl: "https://maps.google.com",
		name: "Pier 76",
		state: "NY",
		zip: "10001",
	},
	hours: [
		{ _key: "day-1", close: "6:00 PM", day: "Thursday", open: "9:00 AM" },
		{ _key: "day-2", close: "5:00 PM", day: "Friday", open: "9:00 AM" },
	],
	timelineSections: [
		{
			_key: "timeline-before-show",
			entries: [
				{
					_key: "deadline-rendering",
					date: "2026-07-27",
					deliverables: [
						{ _key: "deadline-rendering-1", label: "Large booth rendering" },
						{ _key: "deadline-rendering-2", label: "Full payment", timeRange: "Due by 5:00 PM" },
					],
					relativeLabel: "(45 days before)",
				},
				{
					_key: "deadline-submissions",
					date: "2026-08-20",
					deliverables: [
						{ _key: "deadline-submissions-1", label: "COI" },
						{ _key: "deadline-submissions-2", label: "Backwall graphic" },
						{ _key: "deadline-submissions-3", label: "Exhibiting brands" },
						{ _key: "deadline-submissions-4", label: "Cannabis license" },
					],
				},
			],
			title: "Before show",
		},
		{
			_key: "timeline-show-week",
			entries: [
				{
					_key: "load-in",
					date: "2026-09-10",
					deliverables: [{ _key: "load-in-1", label: "Load in", timeRange: "10:00 AM-5:00 PM" }],
					note: "Craft exempt has a separate arrival window.",
				},
				{
					_key: "show-day-1",
					date: "2026-09-11",
					deliverables: [
						{ _key: "show-day-1-1", label: "Show day 1", timeRange: "10:00 AM-5:00 PM" },
					],
				},
				{
					_key: "show-day-2",
					date: "2026-09-12",
					deliverables: [
						{ _key: "show-day-2-1", label: "Show day 2", timeRange: "10:00 AM-5:00 PM" },
						{ _key: "show-day-2-2", label: "Load out", timeRange: "5:00 PM-8:00 PM" },
					],
				},
			],
			title: "Show week",
		},
	],
};

const docs: ExhibitorDocPage[] = [
	{
		_id: "doc-check-in",
		body: [
			{
				_key: "intro-heading",
				_type: "block",
				children: [
					{
						_key: "intro-heading-child",
						_type: "span",
						marks: [],
						text: "Check-in timing",
					},
				],
				markDefs: [],
				style: "h2",
			},
			{
				_key: "intro-paragraph",
				_type: "block",
				children: [
					{
						_key: "intro-paragraph-child",
						_type: "span",
						marks: [],
						text: "Badge pickup opens the day before move-in and stays open throughout load-in.",
					},
				],
				markDefs: [],
				style: "normal",
			},
			{
				_key: "callout-1",
				_type: "callout",
				body: "Every booth supervisor must be present with a valid photo ID before freight can be released.",
				title: "Arrival requirement",
				tone: "warning",
			},
			{
				_key: "setup-heading",
				_type: "block",
				children: [
					{
						_key: "setup-heading-child",
						_type: "span",
						marks: [],
						text: "Checklist",
					},
				],
				markDefs: [],
				style: "h2",
			},
			{
				_key: "code-1",
				_type: "codeBlock",
				code: "1. Upload insurance certificate\n2. Confirm product list\n3. Schedule freight arrival\n4. Book exhibitor parking",
				filename: "move-in-checklist.txt",
				language: "text",
			},
		],
		category: "show-info",
		description: "Arrival windows, badge pickup, and day-of check-in flow.",
		publishedAt: "2026-06-01T00:00:00.000Z",
		slug: "arrival-and-check-in",
		title: "Arrival and check-in",
	},
	{
		_id: "doc-compliance",
		body: [
			{
				_key: "compliance-heading",
				_type: "block",
				children: [
					{
						_key: "compliance-heading-child",
						_type: "span",
						marks: [],
						text: "Display standards",
					},
				],
				markDefs: [],
				style: "h2",
			},
			{
				_key: "compliance-paragraph",
				_type: "block",
				children: [
					{
						_key: "compliance-paragraph-child",
						_type: "span",
						marks: [],
						text: "All displayed products must match the approved exhibitor inventory and remain within assigned booth boundaries.",
					},
				],
				markDefs: [],
				style: "normal",
			},
		],
		category: "cannabis-guidelines",
		description: "State-specific display, packaging, and handling rules.",
		publishedAt: "2026-06-03T00:00:00.000Z",
		slug: "display-and-compliance",
		title: "Display and compliance",
	},
];

const booths: BoothTypePage[] = [
	{
		_id: "booth-boutique",
		description:
			"Boutique booths are built for premium merchandising with more frontage and backwall branding.",
		dimensions: "10 x 20",
		images: [],
		includes: ["Backwall graphics", "Two exhibitor passes", "Shared power drop"],
		name: "Boutique",
		price: 8500,
		slug: "boutique",
		specs: [
			{
				_key: "booth-specs",
				_type: "block",
				children: [
					{
						_key: "booth-specs-child",
						_type: "span",
						marks: [],
						text: "Boutique booths support low-profile shelving, standard refrigerated cases, and approved brand signage.",
					},
				],
				markDefs: [],
				style: "normal",
			},
		],
	},
];

const faqs: FaqPage[] = [
	{
		_id: "faq-parking",
		answer: [
			{
				_key: "faq-answer",
				_type: "block",
				children: [
					{
						_key: "faq-answer-child",
						_type: "span",
						marks: [],
						text: "Parking instructions are sent one week before the show and are tied to the move-in slot listed in your exhibitor confirmation.",
					},
				],
				markDefs: [],
				style: "normal",
			},
		],
		question: "When do I receive parking instructions?",
		slug: "parking-instructions",
	},
];

export function getMockConferenceSummaries(): ConferenceSummary[] {
	return [activeConference];
}

export function getMockConferenceBundle(slug: string) {
	if (slug !== activeConference.slug) return null;

	return {
		booths,
		conference: activeConference,
		docs,
		faqs,
	};
}

export function getMockDocPage(slug: string) {
	return docs.find((doc) => doc.slug === slug) ?? null;
}

export function getMockBoothPage(slug: string) {
	return booths.find((booth) => booth.slug === slug) ?? null;
}

export function getMockFaqPage(slug: string) {
	return faqs.find((faq) => faq.slug === slug) ?? null;
}

export function searchMockConference(query: string): ConferenceSearchMatches {
	const normalized = query.trim().toLowerCase();
	if (!normalized) {
		return {
			booths: [],
			docs: [],
			faqs: [],
		};
	}

	const docMatches = docs.filter((doc) =>
		`${doc.title} ${doc.description ?? ""}`.toLowerCase().includes(normalized),
	);
	const boothMatches = booths.filter((booth) =>
		`${booth.name} ${booth.description ?? ""}`.toLowerCase().includes(normalized),
	);
	const faqMatches = faqs.filter((faq) => faq.question.toLowerCase().includes(normalized));

	return {
		booths: boothMatches.map<BoothTypePage>((booth) => booth),
		docs: docMatches.map<ExhibitorDocSummary>((doc) => doc),
		faqs: faqMatches.map<FaqSummary>((faq) => faq),
	};
}
