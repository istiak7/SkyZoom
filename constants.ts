import { Airline, Airport } from './types';

export const AIRPORTS: Airport[] = [
  { code: 'DAC', city: 'Dhaka', name: 'Hazrat Shahjalal Intl' },
  { code: 'CXB', city: "Cox's Bazar", name: 'Cox\'s Bazar Airport' },
  { code: 'JFK', city: 'New York', name: 'John F. Kennedy Intl' },
  { code: 'LHR', city: 'London', name: 'Heathrow Airport' },
  { code: 'DXB', city: 'Dubai', name: 'Dubai Intl' },
  { code: 'SIN', city: 'Singapore', name: 'Changi Airport' },
  { code: 'BKK', city: 'Bangkok', name: 'Suvarnabhumi Airport' },
];

export const AIRLINES: Airline[] = [
  { name: 'Biman Bangladesh', logo: 'https://picsum.photos/seed/biman/40/40' },
  { name: 'US-Bangla', logo: 'https://picsum.photos/seed/usbangla/40/40' },
  { name: 'Novoair', logo: 'https://picsum.photos/seed/novo/40/40' },
  { name: 'Air Astra', logo: 'https://picsum.photos/seed/astra/40/40' },
  { name: 'Emirates', logo: 'https://picsum.photos/seed/emirates/40/40' },
  { name: 'Singapore Air', logo: 'https://picsum.photos/seed/singapore/40/40' },
];