import { BrandDNA } from './brand-dna';

// Re-export BrandDNA for backwards compatibility and easy access
export { BrandDNA };

// Site configuration using BrandDNA values
export const siteConfig = {
  name: BrandDNA.identity.companyName,
  url: BrandDNA.social.website,
  phone: BrandDNA.contact.primaryPhone,
  phoneTel: BrandDNA.contact.primaryPhone.replace(/[^0-9+]/g, ''),
  whatsapp: BrandDNA.contact.whatsappNumber,
  email: BrandDNA.contact.supportEmail,
  address: BrandDNA.location.headquartersAddress,
  openingHoursSchema: 'Mo-Su 00:00-24:00',
  latitude: BrandDNA.location.latitude,
  longitude: BrandDNA.location.longitude,
  aboutText: 'GuardMan Chile es una empresa lider en servicios de seguridad privada en Santiago de Chile.',
  brandVoice: BrandDNA.voice.description,
  hours: BrandDNA.businessHours.map(h => ({
    day: h.day,
    hours: h.closed ? 'Cerrado' : '24 horas',
  })),
  usps: BrandDNA.differentiators
    .filter(d => d.featured)
    .map(d => ({
      title: d.title,
      description: d.description,
    })),
  social: {
    instagram: BrandDNA.social.instagram,
    youtube: BrandDNA.social.youtube,
  },
  stats: {
    guards: BrandDNA.stats.guards,
    clients: BrandDNA.stats.clients,
    locations: BrandDNA.stats.locations,
    years: BrandDNA.stats.years,
  },
} as const;
