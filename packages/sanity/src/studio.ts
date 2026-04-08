export {
	blockContentType,
	calloutType,
	codeBlockType,
	conferenceHoursType,
	venueType,
} from "./schema/block-content";
export { boothType } from "./schema/booth-type";
export {
	accordionBlockType,
	accordionItemType,
	bannerBlockType,
	cardGridType,
	cardItemType,
	fileItemType,
	filesBlockType,
	imageZoomType,
	stepItemType,
	stepsBlockType,
	tabItemType,
	tabsBlockType,
} from "./schema/components";
export { conferenceType } from "./schema/conference";
export { exhibitorDocType } from "./schema/exhibitor-doc";
export { exhibitorFaqType } from "./schema/exhibitor-faq";
export { faqType } from "./schema/faq";
export { staffType } from "./schema/staff";
export { staffRoleType } from "./schema/staff-role";
export { deskStructure } from "./structure";

import {
	blockContentType,
	calloutType,
	codeBlockType,
	conferenceHoursType,
	venueType,
} from "./schema/block-content";
import { boothType } from "./schema/booth-type";
import {
	accordionBlockType,
	accordionItemType,
	bannerBlockType,
	cardGridType,
	cardItemType,
	fileItemType,
	filesBlockType,
	imageZoomType,
	stepItemType,
	stepsBlockType,
	tabItemType,
	tabsBlockType,
} from "./schema/components";
import { conferenceType } from "./schema/conference";
import { exhibitorDocType } from "./schema/exhibitor-doc";
import { exhibitorFaqType } from "./schema/exhibitor-faq";
import { faqType } from "./schema/faq";
import { staffType } from "./schema/staff";
import { staffRoleType } from "./schema/staff-role";

export const schemaTypes = [
	blockContentType,
	calloutType,
	codeBlockType,
	conferenceHoursType,
	venueType,
	conferenceType,
	staffRoleType,
	staffType,
	exhibitorDocType,
	exhibitorFaqType,
	boothType,
	faqType,
	stepItemType,
	stepsBlockType,
	tabItemType,
	tabsBlockType,
	accordionBlockType,
	accordionItemType,
	cardGridType,
	cardItemType,
	bannerBlockType,
	imageZoomType,
	fileItemType,
	filesBlockType,
];
