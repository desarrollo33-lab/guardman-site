/**
 * Directus CMS Data Layer
 * Reads pre-fetched JSON data from src/data/generated/
 * Data is fetched at build time via scripts/fetch-cms-data.mjs
 */

import servicesData from './generated/services.json';
import locationsData from './generated/locations.json';
import sectorsData from './generated/sectors.json';
import clientsData from './generated/clients.json';
import testimonialsData from './generated/testimonials.json';
import siteConfigData from './generated/site-config.json';

// Directus URL for asset URLs
const DIRECTUS_URL = 'http://64.176.16.231:8055';

/**
 * Get the full URL for a Directus asset
 */
export function getImageUrl(assetId: string | null | undefined): string | null {
  if (!assetId) return null;
  return `${DIRECTUS_URL}/assets/${assetId}`;
}

// Types
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
  featured: boolean;
  status: string;
  sort: number;
  image: string;
}

export interface Location {
  id: number;
  name: string;
  slug: string;
  zone: string;
  description: string;
  neighborhoods: string[];
  landmarks?: string[];
  stats?: { empresas: string; guardias: string; experiencia: string };
  priority_score: number;
  latitude: number;
  longitude: number;
  meta_title: string;
  meta_description: string;
  featured: boolean;
  image: string | null;
  status: string;
  sort: number;
}

export interface Sector {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
  hero_title: string;
  hero_subtitle: string;
  challenges: { title: string; description: string }[];
  meta_title: string;
  meta_description: string;
  featured: boolean;
  image: string | null;
  status: string;
  sort: number;
}

export interface Client {
  id: number;
  name: string;
  industry: string;
  services: string[];
  logo_url: string;
  featured: boolean;
  status: string;
  sort: number;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  sector: string;
  featured: boolean;
  status: string;
  sort: number;
}

export interface SiteConfig {
  site_name: string;
  legal_name: string;
  rut: string;
  tagline: string;
  description: string;
  about_text: string;
  phone: string;
  phone_display: string;
  whatsapp: string;
  email: string;
  commercial_email: string;
  address: string;
  latitude: number;
  longitude: number;
  site_url: string;
  social_instagram: string;
  social_youtube: string;
  stats_guards: string;
  stats_clients: string;
  stats_locations: string;
  stats_years: string;
  seo_title: string;
  seo_description: string;
  hero_image: string | null;
  hours: { day: string; hours: string }[];
  usps: { title: string; description: string; icon: string }[];
  certifications: { name: string; description: string }[];
}

// Use imported JSON data with defaults
const services = (servicesData as any[]).map(item => ({
  ...item,
  features: item.features || [],
  process: item.process || [],
  common_issues: item.common_issues || [],
  featured: item.featured || false,
})) as Service[];

const locations = (locationsData as any[]).map(item => ({
  ...item,
  neighborhoods: item.neighborhoods || [],
  featured: item.featured || false,
})) as Location[];

const sectors = (sectorsData as any[]).map(item => ({
  ...item,
  challenges: item.challenges || [],
  featured: item.featured || false,
})) as Sector[];

const clients = (clientsData as any[]).map(item => ({
  ...item,
  services: item.services || [],
})) as Client[];

const testimonials = (testimonialsData as any[]).map(item => ({
  ...item,
})) as Testimonial[];

const siteConfig = siteConfigData as SiteConfig | null;

// API functions that return the cached data (synchronous - data is pre-loaded at build time)
export function getServices(): Service[] {
  return services;
}

export function getServiceBySlug(slug: string): Service | null {
  return services.find(s => s.slug === slug) || null;
}

export function getFeaturedServices(): Service[] {
  return services.filter(s => s.featured);
}

export function getLocations(): Location[] {
  return locations;
}

export function getLocationBySlug(slug: string): Location | null {
  return locations.find(l => l.slug === slug) || null;
}

export function getFeaturedLocations(): Location[] {
  return locations.filter(l => l.featured);
}

export function getSectors(): Sector[] {
  return sectors;
}

export function getSectorBySlug(slug: string): Sector | null {
  return sectors.find(s => s.slug === slug) || null;
}

export function getFeaturedSectors(): Sector[] {
  return sectors.filter(s => s.featured);
}

export function getFeaturedClients(): Client[] {
  return clients.filter(c => c.featured);
}

export function getClients(): Client[] {
  return clients;
}

export function getTestimonials(): Testimonial[] {
  return testimonials;
}

export function getSiteConfig(): SiteConfig | null {
  return siteConfig;
}
