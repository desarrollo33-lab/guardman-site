/**
 * Static Data Layer — GuardMan Chile (v1.12)
 *
 * Refactored: Services, Locations, Sectors now delegate to cms.ts (D1 CMS).
 * This module handles: Blog, Clients, Testimonials, SiteConfig (generated data).
 *
 * For CMS-driven content (services, locations, sectors), use:
 *   import { getServicesList, getLocationsList, getSectorsList } from './cms';
 */

import clientsData from './generated/clients.json';
import testimonialsData from './generated/testimonials.json';
import blogData from './generated/blog.json';
import siteConfigData from './generated/site-config.json';
import { getServicesList, getLocationsList, getSectorsList } from './cms';

// Re-export CMS list functions for backward compatibility
export { getServicesList as getServices, getLocationsList as getLocations, getSectorsList as getSectors } from './cms';
export { optimizeImageUrl } from './cms-helpers';

// === Types ===

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

// === Data ===

const clients = clientsData as Client[];
const testimonials = testimonialsData as Testimonial[];
const blog = blogData as BlogPost[];
const siteConfig = siteConfigData as SiteConfig;

// === Client Functions ===

export function getFeaturedClients(): Client[] {
  return clients.filter(c => c.featured && c.status === 'published').sort((a, b) => a.sort - b.sort);
}

export function getClients(): Client[] {
  return clients.filter(c => c.status === 'published');
}

// === Testimonial Functions ===

export function getTestimonials(): Testimonial[] {
  return testimonials.filter(t => t.status === 'published').sort((a, b) => a.sort - b.sort);
}

// === Site Config ===

export function getSiteConfig(): SiteConfig {
  return siteConfig;
}

// === Blog Functions ===

export function getBlogPosts(): BlogPost[] {
  return blog.filter(p => p.status === 'published').sort((a, b) => b.sort - a.sort);
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  return blog.find(p => p.slug === slug && p.status === 'published') || null;
}

export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  const current = blog.find(p => p.slug === currentSlug);
  if (!current) return blog.slice(0, limit);

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

// === Combinations ===

export function getServiceLocationPairs(): { serviceSlug: string; locationSlug: string }[] {
  const publishedServices = getServicesList();
  const publishedLocations = getLocationsList();

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
