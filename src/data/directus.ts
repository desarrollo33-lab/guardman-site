const DIRECTUS_URL = 'http://64.176.16.231:8055';

export interface Service {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  hero_heading: string;
  meta_title: string;
  meta_description: string;
  price_range: string;
  features: string[];
  process: { step: string; description: string }[];
  common_issues: string[];
  status: string;
  sort: number;
}

export interface Location {
  id: number;
  name: string;
  slug: string;
  zone: string;
  description: string;
  neighborhoods: string[];
  priority_score: number;
  latitude: number;
  longitude: number;
  meta_title: string;
  meta_description: string;
  status: string;
  sort: number;
}

export interface SiteConfig {
  site_name: string;
  site_url: string;
  phone: string;
  phone_tel: string;
  email: string;
  address: string;
  opening_hours_schema: string;
  latitude: number;
  longitude: number;
  about_text: string;
  brand_voice: string;
  hours: { day: string; hours: string }[];
  usps: { title: string; description: string }[];
  social_links: { instagram?: string; youtube?: string };
  stats: { guards: string; clients: string; locations: string; years: string };
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  location: string;
}

// Fetch all published services
export async function getServices(): Promise<Service[]> {
  const res = await fetch(`${DIRECTUS_URL}/items/services?filter={"status":{"_eq":"published"}}&sort=sort&limit=-1`);
  const data = await res.json();
  return data.data || [];
}

// Fetch all published locations
export async function getLocations(): Promise<Location[]> {
  const res = await fetch(`${DIRECTUS_URL}/items/locations?filter={"status":{"_eq":"published"}}&sort=sort&limit=-1`);
  const data = await res.json();
  return data.data || [];
}

// Fetch single service by slug
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const res = await fetch(`${DIRECTUS_URL}/items/services?filter={"slug":{"_eq":"${slug}"},"status":{"_eq":"published"}}&limit=1`);
  const data = await res.json();
  return data.data?.[0] || null;
}

// Fetch single location by slug
export async function getLocationBySlug(slug: string): Promise<Location | null> {
  const res = await fetch(`${DIRECTUS_URL}/items/locations?filter={"slug":{"_eq":"${slug}"},"status":{"_eq":"published"}}&limit=1`);
  const data = await res.json();
  return data.data?.[0] || null;
}

// Fetch testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  const res = await fetch(`${DIRECTUS_URL}/items/testimonials?filter={"status":{"_eq":"published"}}&sort=sort&limit=10`);
  const data = await res.json();
  return data.data || [];
}

// Fetch site config (singleton)
export async function getSiteConfig(): Promise<SiteConfig | null> {
  const res = await fetch(`${DIRECTUS_URL}/items/site_config?limit=1`);
  const data = await res.json();
  return data.data?.[0] || null;
}
