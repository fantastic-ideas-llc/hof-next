export const ACTIVE_CONFERENCES_QUERY = `
	*[
		_type == "conference" &&
		status == "active"
	] | order(startDate asc) {
		_id,
		name,
		"slug": slug.current,
		status,
		startDate,
		endDate,
		"city": venue.city,
		"state": venue.state,
		description
	}
`;

export const CONFERENCE_BY_SLUG_QUERY = `
	*[
		_type == "conference" &&
		slug.current == $conferenceSlug
	][0] {
		_id,
		name,
		"slug": slug.current,
		status,
		startDate,
		endDate,
		venue,
		hours,
		timelineSections[]{
			_key,
			title,
			entries[]{
				_key,
				date,
				relativeLabel,
				deliverables[]{
					_key,
					label,
					timeRange
				},
				note
			}
		},
		description,
		contacts[]->{
			_id,
			name,
			email,
			"roles": select(
				count(roles) > 0 => roles[]->title,
				defined(role) => [role->title],
				[]
			)
		}
	}
`;

export const DOCS_FOR_CONFERENCE_QUERY = `
	*[
		_type == "exhibitorDoc" &&
		references($conferenceId)
	] | order(category asc, sortOrder asc, title asc) {
		_id,
		title,
		"slug": slug.current,
		category,
		description,
		publishedAt
	}
`;

export const DOC_PAGE_QUERY = `
	*[
		_type == "exhibitorDoc" &&
		references($conferenceId) &&
		slug.current == $slug
	][0] {
		_id,
		title,
		"slug": slug.current,
		category,
		description,
		publishedAt,
		body
	}
`;

export const DOC_PAGE_BY_SLUGS_QUERY = `
	*[
		_type == "exhibitorDoc" &&
		conference->slug.current == $conferenceSlug &&
		slug.current == $slug
	][0] {
		_id,
		title,
		"slug": slug.current,
		category,
		description,
		publishedAt,
		body
	}
`;

export const BOOTHS_FOR_CONFERENCE_QUERY = `
	*[
		_type == "boothType" &&
		references($conferenceId)
	] | order(name asc) {
		_id,
		name,
		"slug": slug.current,
		description,
		dimensions,
		price,
		includes
	}
`;

export const BOOTH_PAGE_QUERY = `
	*[
		_type == "boothType" &&
		references($conferenceId) &&
		slug.current == $slug
	][0] {
		_id,
		name,
		"slug": slug.current,
		description,
		dimensions,
		price,
		includes,
		specs,
		images
	}
`;

export const BOOTH_PAGE_BY_SLUGS_QUERY = `
	*[
		_type == "boothType" &&
		conference->slug.current == $conferenceSlug &&
		slug.current == $slug
	][0] {
		_id,
		name,
		"slug": slug.current,
		description,
		dimensions,
		price,
		includes,
		specs,
		images
	}
`;

export const FAQS_FOR_CONFERENCE_QUERY = `
	*[
		_type in ["exhibitorFaq", "faq"] &&
		references($conferenceId) &&
		(_type != "faq" || audience in ["exhibitor", "both"])
	] | order(sortOrder asc, question asc) {
		_id,
		question,
		"slug": slug.current
	}
`;

export const FAQ_PAGE_QUERY = `
	*[
		_type in ["exhibitorFaq", "faq"] &&
		references($conferenceId) &&
		(_type != "faq" || audience in ["exhibitor", "both"]) &&
		slug.current == $slug
	][0] {
		_id,
		question,
		"slug": slug.current,
		answer
	}
`;

export const FAQ_PAGE_BY_SLUGS_QUERY = `
	*[
		_type in ["exhibitorFaq", "faq"] &&
		conference->slug.current == $conferenceSlug &&
		(_type != "faq" || audience in ["exhibitor", "both"]) &&
		slug.current == $slug
	][0] {
		_id,
		question,
		"slug": slug.current,
		answer
	}
`;

export const CONFERENCE_SEARCH_QUERY = `
	{
		"docs": *[
			_type == "exhibitorDoc" &&
			references($conferenceId) &&
			title match $search
		] | order(category asc, sortOrder asc, title asc) {
			_id,
			title,
			"slug": slug.current,
			category,
			description,
			publishedAt
		},
		"booths": *[
			_type == "boothType" &&
			references($conferenceId) &&
			name match $search
		] | order(name asc) {
			_id,
			name,
			"slug": slug.current,
			description,
			dimensions,
			price,
			includes
		},
		"faqs": *[
			_type in ["exhibitorFaq", "faq"] &&
			references($conferenceId) &&
			(_type != "faq" || audience in ["exhibitor", "both"]) &&
			question match $search
		] | order(sortOrder asc, question asc) {
			_id,
			question,
			"slug": slug.current
		}
	}
`;
