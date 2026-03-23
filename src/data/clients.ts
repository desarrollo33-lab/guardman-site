/**
 * GuardMan Chile - Clients Data
 * Real clients from guardman.cl
 */

export interface Client {
  id: number;
  name: string;
  industry: string;
  services: string[];
  logo?: string;
}

export const clients: Client[] = [
  {
    id: 1,
    name: 'Courtyard by Marriott',
    industry: 'Hotelería',
    services: ['Guardias de Seguridad'],
  },
  {
    id: 2,
    name: 'Hamptons',
    industry: 'Inmobiliario',
    services: ['Guardias de Seguridad', 'Aseo'],
  },
  {
    id: 3,
    name: 'Kavak',
    industry: 'Automotriz',
    services: ['Guardias de Seguridad'],
  },
  {
    id: 4,
    name: 'Hoy Estoril',
    industry: 'Inmobiliario',
    services: ['Guardias de Seguridad', 'Aseo'],
  },
  {
    id: 5,
    name: 'Embajadas',
    industry: 'Diplomático',
    services: ['Seguridad para Embajadas'],
  },
  {
    id: 6,
    name: 'Work Center',
    industry: 'Oficinas',
    services: ['Control de Accesos'],
  },
  {
    id: 7,
    name: 'Avanza Park',
    industry: 'Inmobiliario',
    services: ['Control de Accesos'],
  },
  {
    id: 8,
    name: 'Condominios',
    industry: 'Residencial',
    services: ['Guardias de Seguridad', 'Patrullas'],
  },
];

// Featured clients for homepage display (logo-style text)
export const featuredClients = [
  'Courtyard by Marriott',
  'Hamptons',
  'Kavak',
  'Hoy Estoril',
  'Embajadas',
  'Work Center',
  'Avanza Park',
  'Condominios',
];
