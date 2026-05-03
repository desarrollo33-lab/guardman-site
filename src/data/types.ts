/**
 * GuardMan Chile — Centralized TypeScript Types
 * Single source of truth for all CMS data structures.
 */

// === CMS Master Records (from services.json, locations.json, sectors.json) ===

export interface ServiceMaster {
  id: number;
  slug: string;
  name: string;
  short_description: string;
  price_range: string;
  status: string;
  featured: number;
  sort: number;
  hero_image: string | null;
  related_services: string;
  upsell_services: string;
  created_at: string;
  updated_at: string;
}

export interface LocationMaster {
  id: number;
  slug: string;
  name: string;
  zone: string;
  region: string;
  latitude: number;
  longitude: number;
  status: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface SectorMaster {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  status: string;
  sort: number;
  hero_image: string | null;
  issues: string | null;
  created_at: string;
  updated_at: string;
}

// === CMS Content Sections ===

export interface HeroSection {
  heading: string;
  subheading: string;
  image?: string;
}

export interface IntroSection {
  heading?: string;
  title?: string;
  content?: string;
  paragraphs?: string[];
  image?: string;
}

export interface FeaturesSection {
  heading?: string;
  title?: string;
  items?: string[];
}

export interface IssuesSection {
  heading?: string;
  title?: string;
  items?: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQsSection {
  heading?: string;
  title?: string;
  items?: FAQItem[];
}

export interface CTASection {
  headline?: string;
  heading?: string;
  subheading?: string;
  description?: string;
  button?: string;
  button_text?: string;
  image?: string;
}

export interface ProcessStep {
  step?: string;
  title?: string;
  description?: string;
}

export interface StatsItem {
  label: string;
  value: string;
}

export interface StaffSection {
  image?: string;
  title?: string;
  description?: string;
  traits?: string[];
}

export interface MetaSection {
  title: string;
  description: string;
}

// === Entity Sections (contenido CMS por entidad) ===

export interface EntitySections {
  hero?: HeroSection;
  meta?: MetaSection;
  intro?: IntroSection;
  features?: FeaturesSection;
  coverage?: { heading?: string; items?: string[] };
  issues?: IssuesSection;
  process?: ProcessStep[] | Record<string, ProcessStep>;
  stats?: { heading?: string; items?: StatsItem[] };
  faqs?: FAQsSection | Record<string, FAQItem>;
  cta?: CTASection;
  staff?: StaffSection;
}

// === Entity Content File (wrapper) ===

export interface EntityContentFile {
  sections: EntitySections;
  sectorSlug?: string;
  related_content?: {
    related_services?: RelatedServiceItem[];
    nearby_locations?: NearbyLocationItem[];
    upsell_services?: UpsellServiceItem[];
  };
  seo?: {
    title?: string;
    description?: string;
  };
  content?: EntitySections;
}

// === Related Content Types ===

export interface RelatedServiceItem {
  slug: string;
  title?: string;
  name?: string;
  excerpt?: string;
}

export interface NearbyLocationItem {
  slug: string;
  title?: string;
  name?: string;
}

export interface UpsellServiceItem {
  slug: string;
  title?: string;
  reason?: string;
  price_range?: string;
}

// === Brand DNA ===

export interface BrandDNA {
  company: Record<string, string>;
  social: Record<string, string>;
  stats: Record<string, string | number>;
  hours: { schedule: { day: string; hours: string }[]; summary: string };
  voice: Record<string, string>;
  differentiators: Record<string, string>;
  exclusions: Record<string, string>;
  certifications: Record<string, string>;
  usps: Record<string, string>;
  colors: Record<string, string>;
}

// === Media ===

export interface MediaEntry {
  key: string;
  alt: string;
}

export type MediaMap = Record<string, Record<string, Record<string, MediaEntry>>>;

// === Zone Data ===

export interface ZoneData {
  focus: string;
  common_needs: string;
  intro: string;
  issues: string[];
}
