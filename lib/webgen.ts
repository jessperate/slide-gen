// ── Web Section Types ────────────────────────────────────────────────────────
// Structured data for each section type rendered by the webgen editor.
// The AI returns an array of these; React components render + allow inline editing.

export interface HeroSection {
  id: string;
  type: 'hero';
  eyebrow?: string;
  headlineSerif: string;   // Line 1 of H2 composition (Serrif VF)
  headlineSans: string;    // Line 2 of H2 composition (Saans)
  body: string;
  ctaLabel: string;
  ctaUrl?: string;
  imageUrl?: string;       // optional product screenshot below
}

export interface StatCard {
  heading: string;
  stat: string;
  direction: 'up' | 'down';
  description: string;
}

export interface StatsSection {
  id: string;
  type: 'stats';
  eyebrow?: string;
  headlineSerif: string;
  headlineSans: string;
  body?: string;
  cards: StatCard[];
}

export interface TestimonialSection {
  id: string;
  type: 'testimonial';
  quote: string;
  personName: string;       // First + Last, rendered serif+sans split
  title: string;
  companyLogo?: string;     // domain for brandfetch or data URL
  photoUrl?: string;
  stat?: { value: string; label: string };
}

export interface FeatureCard {
  title: string;
  description: string;
  color: 'pink' | 'red' | 'yellow' | 'indigo';  // card accent
}

export interface FeaturesSection {
  id: string;
  type: 'features';
  eyebrow?: string;
  headlineSerif: string;
  headlineSans: string;
  body?: string;
  cards: FeatureCard[];
}

export interface ManifestoSection {
  id: string;
  type: 'manifesto';
  headline: string;
  body: string;              // key phrase at full opacity, rest faded
  highlightPhrase?: string;  // the phrase to keep full opacity
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSection {
  id: string;
  type: 'faq';
  headline: string;
  items: FAQItem[];
}

export interface CTASection {
  id: string;
  type: 'cta';
  eyebrow?: string;
  headline: string;
  body?: string;
  ctaLabel: string;
  ctaUrl?: string;
  variant: 'dark' | 'indigo';
}

export interface SocialProofQuote {
  quote: string;
  attribution: string;
  company?: string;
  color: 'yellow' | 'pink' | 'green' | 'blue' | 'purple' | 'teal';
}

export interface SocialProofSection {
  id: string;
  type: 'social-proof';
  headlineSerif?: string;
  headlineSans?: string;
  quotes: SocialProofQuote[];
}

export type WebSection =
  | HeroSection
  | StatsSection
  | TestimonialSection
  | FeaturesSection
  | ManifestoSection
  | FAQSection
  | CTASection
  | SocialProofSection;

// ── Defaults for adding new sections ─────────────────────────────────────────

export const defaultSectionByType: Record<WebSection['type'], WebSection> = {
  hero: {
    id: '',
    type: 'hero',
    eyebrow: 'PLATFORM',
    headlineSerif: 'Craft content',
    headlineSans: 'that wins search.',
    body: 'AirOps helps marketing teams create, optimize, and scale content with AI-powered workflows.',
    ctaLabel: 'Book a demo',
  },
  stats: {
    id: '',
    type: 'stats',
    eyebrow: 'RESEARCH',
    headlineSerif: 'The data',
    headlineSans: 'speaks for itself.',
    cards: [
      { heading: 'Fresh content leads to', stat: '70%', direction: 'up', description: 'more citations in AI search' },
      { heading: 'Proper heading hierarchies earn', stat: '3x', direction: 'up', description: 'higher likelihood of citations' },
      { heading: 'Stale content leads to', stat: '50%', direction: 'down', description: 'drop in visibility' },
    ],
  },
  testimonial: {
    id: '',
    type: 'testimonial',
    quote: 'AirOps transformed how our team creates content. We went from weeks to hours.',
    personName: 'Sarah Chen',
    title: 'VP of Content, Acme Corp',
  },
  features: {
    id: '',
    type: 'features',
    eyebrow: 'PLATFORM FEATURES',
    headlineSerif: 'Everything you need',
    headlineSans: 'to scale content.',
    cards: [
      { title: 'Grids', description: 'Manage every campaign from one powerful interface.', color: 'pink' },
      { title: 'Workflows', description: 'Build complex content systems with drag-and-drop logic.', color: 'red' },
      { title: 'Brand Kits', description: 'Train LLMs on your brand guidelines and voice.', color: 'yellow' },
      { title: 'Integrations', description: 'Connect data sources and push to your CMS.', color: 'indigo' },
    ],
  },
  manifesto: {
    id: '',
    type: 'manifesto',
    headline: 'Content is your most durable competitive advantage.',
    body: 'In a world where everyone has access to the same AI, the brands that win will be the ones that use it to amplify what makes them unique - not replace it.',
    highlightPhrase: 'amplify what makes them unique',
  },
  faq: {
    id: '',
    type: 'faq',
    headline: 'Frequently Asked Questions',
    items: [
      { question: 'How does AirOps work?', answer: 'AirOps connects your brand data, content workflows, and publishing tools into one AI-powered platform.' },
      { question: 'Is my data secure?', answer: 'Yes. All data is encrypted at rest and in transit. We are SOC 2 Type II compliant.' },
      { question: 'How long does setup take?', answer: 'Most teams are up and running within a week with our guided onboarding.' },
    ],
  },
  cta: {
    id: '',
    type: 'cta',
    eyebrow: 'GET STARTED',
    headline: 'Ready to scale your content?',
    body: 'Join the teams already using AirOps to create better content, faster.',
    ctaLabel: 'Book a demo',
    variant: 'indigo',
  },
  'social-proof': {
    id: '',
    type: 'social-proof',
    headlineSerif: 'Trusted by',
    headlineSans: 'the best teams.',
    quotes: [
      { quote: 'AirOps made our content pipeline 5x faster.', attribution: 'Head of Content', company: 'Webflow', color: 'yellow' },
      { quote: 'The brand consistency is unreal.', attribution: 'CMO', company: 'Carta', color: 'pink' },
      { quote: 'We publish 10x more content now.', attribution: 'Director of SEO', company: 'Ramp', color: 'green' },
    ],
  },
};
