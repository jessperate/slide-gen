export interface CoverSlideData {
  id: string;
  type: 'cover';
  eyebrow: string;
  headline: string;
  subheadline?: string;
}

export interface SectionSlideData {
  id: string;
  type: 'section';
  number: string;
  label: string;
  headline: string;
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
}

export interface BackCoverSlideData {
  id: string;
  type: 'back-cover';
  cta: string;
  url: string;
}

export type SlideData =
  | CoverSlideData
  | SectionSlideData
  | DiagramSlideData
  | StatsSlideData
  | ContentSlideData
  | BackCoverSlideData;

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
};

export const METRIC_COLORS: Record<string, string> = {
  olive: '#F5F5E8',
  teal: '#E8EEF5',
  magenta: '#F8E8F0',
};
