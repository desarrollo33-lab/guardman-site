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
  tagline: string;
  description: string;
  phone: string;
  phone_display: string;
  whatsapp: string;
  email: string;
  address: string;
  latitude: number;
  longitude: number;
  hours: { day: string; hours: string }[];
  social_instagram: string;
  social_youtube: string;
  stats_guards: string;
  stats_clients: string;
  stats_locations: string;
  stats_years: string;
  legal_name: string;
  legal_rut: string;
  seo_title: string;
  seo_description: string;
}

// Use imported JSON data
const services = (servicesData as any[]).map(item => ({
  ...item,
  features: item.features || [],
  process: item.process || [],
  common_issues: item.common_issues || [],
})) as Service[];

const locations = (locationsData as any[]).map(item => ({
  ...item,
  neighborhoods: item.neighborhoods || [],
})) as Location[];

const sectors = (sectorsData as any[]).map(item => ({
  ...item,
  challenges: item.challenges || [],
})) as Sector[];

const clients = (clientsData as any[]).map(item => ({
  ...item,
  services: item.services || [],
})) as Client[];

const testimonials = testimonialsData as Testimonial[];

const siteConfig = siteConfigData as SiteConfig | null;

// API functions that return the cached data
export async function getServices(): Promise<Service[]> {
  return services;
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  return services.find(s => s.slug === slug) || null;
}

export async function getLocations(): Promise<Location[]> {
  return locations;
}

export async function getLocationBySlug(slug: string): Promise<Location | null> {
  return locations.find(l => l.slug === slug) || null;
}

export async function getSectors(): Promise<Sector[]> {
  return sectors;
}

export async function getSectorBySlug(slug: string): Promise<Sector | null> {
  return sectors.find(s => s.slug === slug) || null;
}

export async function getFeaturedClients(): Promise<Client[]> {
  return clients;
}

export async function getClients(): Promise<Client[]> {
  return clients;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return testimonials;
}

export async function getSiteConfig(): Promise<SiteConfig | null> {
  return siteConfig;
}
