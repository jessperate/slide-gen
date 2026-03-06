export interface LogoOverlay {
  id: string;
  domain: string;
  x: number;       // 0–100 (% of canvas width), anchor = center
  y: number;       // 0–100 (% of canvas height), anchor = center
  width: number;   // px at 1280×720
  grayscale?: boolean;
}

export interface CoverSlideData {
  id: string;
  type: 'cover';
  eyebrow: string;
  headline: string;
  subheadline?: string;
  hideLogo?: boolean;
  logos?: LogoOverlay[];
  imageUrl?: string;
  imageX?: number;
  imageY?: number;
  imageZoom?: number;
  textScale?: number;
}

export interface SectionSlideData {
  id: string;
  type: 'section';
  number: string;
  label: string;
  headline: string;
  hideLogo?: boolean;
  logos?: LogoOverlay[];
  textScale?: number;
}

export interface DiagramColumn {
  header: string;
  body: string;
  tag?: string;
}

export interface DiagramSlideData {
  id: string;
  type: 'diagram';
  headline: string;
  columns: DiagramColumn[];
  hideLogo?: boolean;
  logos?: LogoOverlay[];
  textScale?: number;
}

export interface Metric {
  value: string;
  label: string;
  color: 'olive' | 'teal' | 'magenta';
}

export interface StatsSlideData {
  id: string;
  type: 'stats';
  headline: string;
  thesis: string;
  metrics: Metric[];
  hideLogo?: boolean;
  logos?: LogoOverlay[];
  textScale?: number;
}

export interface ContentColumn {
  heading: string;
  body: string;
}

export interface ContentSlideData {
  id: string;
  type: 'content';
  headline: string;
  columns: ContentColumn[];
  hideLogo?: boolean;
  logos?: LogoOverlay[];
  textScale?: number;
}

export interface BackCoverSlideData {
  id: string;
  type: 'back-cover';
  cta: string;
  url: string;
  hideLogo?: boolean;
  logos?: LogoOverlay[];
  textScale?: number;
}

export interface HeroSlideData {
  id: string;
  type: 'hero';
  headline: string;
  customerLogos: string[];
  hideLogo?: boolean;
  logos?: LogoOverlay[];
  textScale?: number;
}

export interface AgendaSlideData {
  id: string;
  type: 'agenda';
  title: string;
  items: string[];
  hideLogo?: boolean;
  logos?: LogoOverlay[];
  textScale?: number;
}

export interface QuoteSlideData {
  id: string;
  type: 'quote';
  quote: string;
  attribution: string;
  hideLogo?: boolean;
  logos?: LogoOverlay[];
  imageUrl?: string;
  imageX?: number;
  imageY?: number;
  imageZoom?: number;
  textScale?: number;
}

export interface ThreeColItem {
  icon: string;
  header: string;
  body: string;
}

export interface ThreeColSlideData {
  id: string;
  type: 'three-col';
  headline: string;
  columns: ThreeColItem[];
  hideLogo?: boolean;
  logos?: LogoOverlay[];
  textScale?: number;
}

export interface FeatureListItem {
  icon: string;
  title: string;
  body: string;
}

export interface FeatureListSlideData {
  id: string;
  type: 'feature-list';
  headline: string;
  items: FeatureListItem[];
  hideLogo?: boolean;
  logos?: LogoOverlay[];
  textScale?: number;
}

export interface CustomerMetric {
  value: string;
  label: string;
}

export interface CustomerStorySlideData {
  id: string;
  type: 'customer-story';
  customerName: string;
  headline: string;
  body: string;
  attribution: string;
  metrics: CustomerMetric[];
  hideLogo?: boolean;
  logos?: LogoOverlay[];
  textScale?: number;
}

export interface ChecklistItem {
  title: string;
  body: string;
  checked: boolean;
}

export interface ChecklistSlideData {
  id: string;
  type: 'checklist';
  headline: string;
  items: ChecklistItem[];
  hideLogo?: boolean;
  logos?: LogoOverlay[];
  textScale?: number;
}

// ── New slide types ──────────────────────────────────────────────────────────

export interface BigQuoteSlideData {
  id: string;
  type: 'big-quote';
  quote: string;
  attribution: string;
  role?: string;
  imageUrl?: string;
  imageX?: number;
  imageY?: number;
  imageZoom?: number;
  hideLogo?: boolean;
  logos?: LogoOverlay[];
  textScale?: number;
}

export interface TwoColMediaSlideData {
  id: string;
  type: 'two-col-media';
  eyebrow?: string;
  headline: string;
  body: string;
  imageUrl?: string;
  imageX?: number;
  imageY?: number;
  imageZoom?: number;
  hideLogo?: boolean;
  logos?: LogoOverlay[];
  textScale?: number;
}

export interface ContactCard {
  name: string;
  role: string;
  linkedin?: string;
  email?: string;
  website?: string;
}

export interface ContactSlideData {
  id: string;
  type: 'contact';
  headline: string;
  cards: ContactCard[];
  hideLogo?: boolean;
  logos?: LogoOverlay[];
  textScale?: number;
}

export interface TeamMember {
  name: string;
  role: string;
  imageUrl?: string;
}

export interface TeamSlideData {
  id: string;
  type: 'team';
  headline?: string;
  members: TeamMember[];
  hideLogo?: boolean;
  logos?: LogoOverlay[];
  textScale?: number;
}

export interface FullImageSlideData {
  id: string;
  type: 'full-image';
  imageUrl?: string;
  imageX?: number;
  imageY?: number;
  imageZoom?: number;
  caption?: string;
  hideLogo?: boolean;
  logos?: LogoOverlay[];
  textScale?: number;
}

export interface TableSlideData {
  id: string;
  type: 'table';
  headline: string;
  headers: string[];
  rows: string[][];
  hideLogo?: boolean;
  logos?: LogoOverlay[];
  textScale?: number;
}

export type SlideData =
  | CoverSlideData
  | SectionSlideData
  | DiagramSlideData
  | StatsSlideData
  | ContentSlideData
  | BackCoverSlideData
  | HeroSlideData
  | AgendaSlideData
  | QuoteSlideData
  | ThreeColSlideData
  | FeatureListSlideData
  | CustomerStorySlideData
  | ChecklistSlideData
  | BigQuoteSlideData
  | TwoColMediaSlideData
  | ContactSlideData
  | TeamSlideData
  | FullImageSlideData
  | TableSlideData;

export const defaultSlides: SlideData[] = [
  {
    id: '1',
    type: 'cover',
    eyebrow: 'AirOps 2026',
    headline: 'Content operations\nat scale.',
    subheadline: 'AI-powered workflows for modern marketing teams',
  },
  {
    id: '2',
    type: 'section',
    number: '01',
    label: 'The Challenge',
    headline: 'Content teams are stuck in tools,\nnot creating.',
  },
  {
    id: '3',
    type: 'diagram',
    headline: 'How AirOps works',
    columns: [
      {
        header: 'Research',
        body: 'Pull insights from any source — docs, Notion, web — in seconds.',
        tag: 'Input',
      },
      {
        header: 'Create',
        body: 'Generate on-brand drafts using your voice, style guide, and past content.',
        tag: 'Generate',
      },
      {
        header: 'Publish',
        body: 'Route approvals, push to CMS, and measure impact automatically.',
        tag: 'Output',
      },
    ],
  },
  {
    id: '4',
    type: 'stats',
    headline: 'The results speak for themselves.',
    thesis:
      'Teams using AirOps see measurable improvement within the first 30 days of deployment.',
    metrics: [
      { value: '3x', label: 'Faster content production', color: 'olive' },
      { value: '40%', label: 'Reduction in production cost', color: 'teal' },
      { value: '10x', label: 'More output per writer', color: 'magenta' },
    ],
  },
  {
    id: '5',
    type: 'content',
    headline: 'Why teams choose AirOps',
    columns: [
      {
        heading: 'Built for brand consistency',
        body: 'Every output is trained on your style guide, voice, and historical content. No off-brand drafts, no manual cleanup.',
      },
      {
        heading: 'Integrates with your stack',
        body: 'Connect to Notion, HubSpot, Salesforce, and your CMS out of the box. AirOps fits into your workflow, not the other way around.',
      },
    ],
  },
  {
    id: '6',
    type: 'back-cover',
    cta: 'Ready to scale your content operation?',
    url: 'airops.com',
  },
  {
    id: '7',
    type: 'hero',
    headline: 'Craft is the Only\nDurable Strategy',
    customerLogos: ['kayak.com', 'checkr.com', 'hubspot.com', 'notion.so', 'ramp.com', 'webflow.com'],
  },
  {
    id: '8',
    type: 'agenda',
    title: 'Agenda',
    items: ['The AI Content Opportunity', 'How AirOps Works', 'Live Demo', 'Results & ROI', 'Getting Started', 'Q&A'],
  },
  {
    id: '9',
    type: 'quote',
    quote: 'AirOps changed how our entire content team operates. We ship three times faster and the quality has never been higher.',
    attribution: 'VP of Content, Lightspeed',
  },
  {
    id: '10',
    type: 'three-col',
    headline: 'Three pillars of the platform',
    columns: [
      { icon: '◆', header: 'Brand Intelligence', body: 'Train every workflow on your voice, style guide, and past content. No off-brand outputs, ever.' },
      { icon: '↗', header: 'AI-Powered Workflows', body: 'Chain research, drafting, editing, and publishing into one automated pipeline.' },
      { icon: '✦', header: 'Deep Integrations', body: 'Connect to HubSpot, Notion, Salesforce, and your CMS. AirOps fits your stack.' },
    ],
  },
  {
    id: '11',
    type: 'feature-list',
    headline: 'Everything your team needs',
    items: [
      { icon: '◆', title: 'Brand Kits', body: 'Train AirOps on your brand guidelines, tone, and historical content for consistent output every time.' },
      { icon: '↗', title: 'Content Studio', body: 'Build AI workflows that blend automation with human review checkpoints.' },
      { icon: '✦', title: 'AEO Optimization', body: 'Optimize content for AI search engines like Perplexity, ChatGPT, and Google AI Mode.' },
      { icon: '⊞', title: 'Analytics', body: 'Track visibility, citations, and share of voice across all major AI answer engines.' },
      { icon: '⊡', title: 'Integrations', body: 'Use any model, source, or destination — including every major CMS and data warehouse.' },
    ],
  },
  {
    id: '12',
    type: 'customer-story',
    customerName: 'Lightspeed',
    headline: 'How Lightspeed keeps content fresh and ranking',
    body: 'Lightspeed uses AirOps to automate content refreshes across thousands of pages, keeping rankings high without manual effort from their team.',
    attribution: 'Head of Content, Lightspeed',
    metrics: [
      { value: '37%', label: 'Higher Conversion Rate' },
      { value: '15%+', label: 'Uplift in Organic Traffic' },
      { value: '36%', label: 'Increase in Monthly Content Output' },
    ],
  },
  {
    id: '13',
    type: 'checklist',
    headline: 'What you get with AirOps',
    items: [
      { title: 'Brand Kit setup', body: 'Voice, style, and guidelines trained into every workflow.', checked: true },
      { title: 'AI workflow library', body: 'Pre-built workflows for briefs, drafts, refreshes, and more.', checked: true },
      { title: 'CMS integrations', body: 'Publish directly from AirOps to your content system.', checked: false },
      { title: 'AEO monitoring', body: 'Track how often AI engines cite your brand.', checked: false },
      { title: 'Dedicated onboarding', body: 'White-glove setup with a content strategist.', checked: false },
    ],
  },
];

export const defaultSlideByType: Record<string, SlideData> = {
  cover: {
    id: '',
    type: 'cover',
    eyebrow: 'AirOps 2026',
    headline: 'Your headline here.',
    subheadline: 'Supporting subheadline text',
  },
  section: {
    id: '',
    type: 'section',
    number: '01',
    label: 'Section Label',
    headline: 'Section headline goes here.',
  },
  diagram: {
    id: '',
    type: 'diagram',
    headline: 'Diagram headline',
    columns: [
      { header: 'Column One', body: 'Description for column one.', tag: 'Tag' },
      { header: 'Column Two', body: 'Description for column two.', tag: 'Tag' },
      { header: 'Column Three', body: 'Description for column three.', tag: 'Tag' },
    ],
  },
  stats: {
    id: '',
    type: 'stats',
    headline: 'Stats headline',
    thesis: 'Supporting thesis statement about the results.',
    metrics: [
      { value: '3x', label: 'Metric one label', color: 'olive' },
      { value: '40%', label: 'Metric two label', color: 'teal' },
      { value: '10x', label: 'Metric three label', color: 'magenta' },
    ],
  },
  content: {
    id: '',
    type: 'content',
    headline: 'Content headline',
    columns: [
      { heading: 'Column heading one', body: 'Supporting body copy for column one.' },
      { heading: 'Column heading two', body: 'Supporting body copy for column two.' },
    ],
  },
  'back-cover': {
    id: '',
    type: 'back-cover',
    cta: 'Ready to get started?',
    url: 'airops.com',
  },
  hero: {
    id: 'new',
    type: 'hero',
    headline: 'Your Headline\nGoes Here',
    customerLogos: ['hubspot.com', 'notion.so', 'webflow.com'],
  },
  agenda: {
    id: 'new',
    type: 'agenda',
    title: 'Agenda',
    items: ['Topic one', 'Topic two', 'Topic three'],
  },
  quote: {
    id: 'new',
    type: 'quote',
    quote: 'Your customer quote goes here. Make it specific and impactful.',
    attribution: 'Name, Title, Company',
  },
  'three-col': {
    id: 'new',
    type: 'three-col',
    headline: 'Three key points',
    columns: [
      { icon: '◆', header: 'Point One', body: 'Description of the first key point goes here.' },
      { icon: '↗', header: 'Point Two', body: 'Description of the second key point goes here.' },
      { icon: '✦', header: 'Point Three', body: 'Description of the third key point goes here.' },
    ],
  },
  'feature-list': {
    id: 'new',
    type: 'feature-list',
    headline: 'Key features',
    items: [
      { icon: '◆', title: 'Feature name', body: 'Feature description.' },
      { icon: '↗', title: 'Feature name', body: 'Feature description.' },
      { icon: '✦', title: 'Feature name', body: 'Feature description.' },
    ],
  },
  'customer-story': {
    id: 'new',
    type: 'customer-story',
    customerName: 'Customer Name',
    headline: 'How [Company] achieved results with AirOps',
    body: 'Describe the customer challenge, solution, and outcome here.',
    attribution: 'Name, Title',
    metrics: [
      { value: '0%', label: 'Key metric' },
      { value: '0x', label: 'Key metric' },
    ],
  },
  checklist: {
    id: 'new',
    type: 'checklist',
    headline: "What's included",
    items: [
      { title: 'Item one', body: 'Description of this item.', checked: false },
      { title: 'Item two', body: 'Description of this item.', checked: false },
      { title: 'Item three', body: 'Description of this item.', checked: false },
    ],
  },
  'big-quote': {
    id: 'new',
    type: 'big-quote',
    quote: 'Your most impactful customer quote goes here. Make it bold and specific.',
    attribution: 'Name, Title',
    role: 'Company Name',
  },
  'two-col-media': {
    id: 'new',
    type: 'two-col-media',
    eyebrow: 'Key Insight',
    headline: 'A bold headline that sets up the visual.',
    body: 'Supporting paragraph that adds context and depth to the visual on the right.',
  },
  contact: {
    id: 'new',
    type: 'contact',
    headline: 'Connect with us',
    cards: [
      { name: 'Your Name', role: 'Title, AirOps', linkedin: 'linkedin.com/in/yourname', email: 'name@airops.com' },
      { name: 'Your Name', role: 'Title, AirOps', linkedin: 'linkedin.com/in/yourname', email: 'name@airops.com' },
    ],
  },
  team: {
    id: 'new',
    type: 'team',
    headline: 'Meet the team',
    members: [
      { name: 'Team Member', role: 'Role, Title' },
      { name: 'Team Member', role: 'Role, Title' },
      { name: 'Team Member', role: 'Role, Title' },
      { name: 'Team Member', role: 'Role, Title' },
    ],
  },
  'full-image': {
    id: 'new',
    type: 'full-image',
  },
  table: {
    id: 'new',
    type: 'table',
    headline: 'Table headline',
    headers: ['Column A', 'Column B', 'Column C'],
    rows: [
      ['Row 1, A', 'Row 1, B', 'Row 1, C'],
      ['Row 2, A', 'Row 2, B', 'Row 2, C'],
      ['Row 3, A', 'Row 3, B', 'Row 3, C'],
    ],
  },
};

export const METRIC_COLORS: Record<string, string> = {
  olive: '#F5F5E8',
  teal: '#E8EEF5',
  magenta: '#F8E8F0',
};
