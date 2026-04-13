/**
 * Static Data Layer - GuardMan Chile
 * 
 * This module provides static data for the site.
 * All data is stored as JSON files in src/data/generated/
 * No external CMS or database required.
 */

import servicesData from './generated/services.json';
import locationsData from './generated/locations.json';
import sectorsData from './generated/sectors.json';
import clientsData from './generated/clients.json';
import testimonialsData from './generated/testimonials.json';
import blogData from './generated/blog.json';
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
  faqs: { question: string; answer: string }[];
  featured: boolean;
  status: string;
  sort: number;
  image: string | null;
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
  why_this_zone?: string;
  priority_score: number;
  latitude: number;
  longitude: number;
  meta_title: string;
  meta_description: string;
  faqs?: { question: string; answer: string }[];
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

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  meta_title: string;
  meta_description: string;
  category: string;
  tags: string[];
  reading_time: number;
  date: string;
  author: string;
  featured_image: string | null;
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
  aggregate_rating_value: string;
  aggregate_rating_count: string;
  seo_title: string;
  seo_description: string;
  hero_image: string | null;
  hours: { day: string; hours: string }[];
  usps: { title: string; description: string; icon: string }[];
  certifications: { name: string; description: string }[];
}

/**
 * Convert image paths to WebP format for optimization
 */
export function optimizeImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null;
  
  // If it's already WebP or external URL, return as-is
  if (imagePath.endsWith('.webp') || imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Convert PNG/JPG/etc to WebP
  const basePath = imagePath.replace(/\.(png|jpg|jpeg|gif)$/i, '.webp');
  return basePath;
}

// Data - typed and normalized
const services = servicesData as Service[];
const locations = locationsData as Location[];
const sectors = sectorsData as Sector[];
const clients = clientsData as Client[];
const testimonials = testimonialsData as Testimonial[];
const blog = blogData as BlogPost[];
const siteConfig = siteConfigData as SiteConfig;

// API Functions
export function getServices(): Service[] {
  return services.filter(s => s.status === 'published').sort((a, b) => a.sort - b.sort);
}

export function getServiceBySlug(slug: string): Service | null {
  return services.find(s => s.slug === slug && s.status === 'published') || null;
}

export function getFeaturedServices(): Service[] {
  return services.filter(s => s.featured && s.status === 'published');
}

export function getLocations(): Location[] {
  return locations.filter(l => l.status === 'published').sort((a, b) => b.priority_score - a.priority_score);
}

export function getLocationBySlug(slug: string): Location | null {
  return locations.find(l => l.slug === slug && l.status === 'published') || null;
}

export function getFeaturedLocations(): Location[] {
  return locations.filter(l => l.featured && l.status === 'published');
}

export function getSectors(): Sector[] {
  return sectors.filter(s => s.status === 'published').sort((a, b) => a.sort - b.sort);
}

export function getSectorBySlug(slug: string): Sector | null {
  return sectors.find(s => s.slug === slug && s.status === 'published') || null;
}

export function getFeaturedSectors(): Sector[] {
  return sectors.filter(s => s.featured && s.status === 'published');
}

export function getFeaturedClients(): Client[] {
  return clients.filter(c => c.featured && c.status === 'published').sort((a, b) => a.sort - b.sort);
}

export function getClients(): Client[] {
  return clients.filter(c => c.status === 'published');
}

export function getTestimonials(): Testimonial[] {
  return testimonials.filter(t => t.status === 'published').sort((a, b) => a.sort - b.sort);
}

export function getSiteConfig(): SiteConfig {
  return siteConfig;
}

export function getBlogPosts(): BlogPost[] {
  return blog.filter(p => p.status === 'published').sort((a, b) => b.sort - a.sort);
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  return blog.find(p => p.slug === slug && p.status === 'published') || null;
}

export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  const current = blog.find(p => p.slug === currentSlug);
  if (!current) return blog.slice(0, limit);
  
  // Prioritize same category, then most recent
  const sameCategory = blog
    .filter(p => p.slug !== currentSlug && p.category === current.category && p.status === 'published')
    .slice(0, limit);
  
  if (sameCategory.length >= limit) return sameCategory;
  
  const others = blog
    .filter(p => p.slug !== currentSlug && p.category !== current.category && p.status === 'published')
    .slice(0, limit - sameCategory.length);
  
  return [...sameCategory, ...others];
}

export function getBlogCategories(): { slug: string; name: string }[] {
  const categoryMap: Record<string, string> = {
    legislacion: 'Legislación',
    guias: 'Guías',
    consejos: 'Consejos',
    empresa: 'Empresa',
    tecnologia: 'Tecnología',
  };
  
  const categories = [...new Set(blog.map(p => p.category))];
  return categories
    .map(slug => ({ slug, name: categoryMap[slug] || slug }))
    .filter(c => c.slug);
}

// Combinations: service + location pages
export function getServiceLocationPairs(): { serviceSlug: string; locationSlug: string }[] {
  const publishedServices = getServices();
  const publishedLocations = getLocations();
  
  const pairs: { serviceSlug: string; locationSlug: string }[] = [];
  
  for (const service of publishedServices) {
    for (const location of publishedLocations) {
      pairs.push({
        serviceSlug: service.slug,
        locationSlug: location.slug,
      });
    }
  }
  
  return pairs;
}
