import { Airline, Airport } from './types';

export const AIRPORTS: Airport[] = [
  { code: 'DAC', city: 'Dhaka', name: 'Hazrat Shahjalal Intl' },
  { code: 'JED', city: 'Jeddah', name: 'King Abdulaziz Intl' },
  { code: 'DXB', city: 'Dubai', name: 'Dubai Intl' },
  { code: 'MCT', city: 'Muscat', name: 'Muscat Intl' },
  { code: 'DOH', city: 'Doha', name: 'Hamad Intl' },
  { code: 'SIN', city: 'Singapore', name: 'Changi Airport' },
  { code: 'MLE', city: 'Male', name: 'Velana Intl' },
  { code: 'BKK', city: 'Bangkok', name: 'Suvarnabhumi Airport' },
  { code: 'KUL', city: 'Kuala Lumpur', name: 'Kuala Lumpur Intl' },
  { code: 'CAN', city: 'Guangzhou', name: 'Guangzhou Baiyun Intl' },
  { code: 'SHJ', city: 'Sharjah', name: 'Sharjah Intl' },
  { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhas Chandra Bose Intl' },
  { code: 'MAA', city: 'Chennai', name: 'Chennai Intl' },
  { code: 'CXB', city: "Cox's Bazar", name: 'Cox\'s Bazar Airport' },
  { code: 'CGP', city: 'Chittagong', name: 'Shah Amanat Intl' },
  { code: 'ZYL', city: 'Sylhet', name: 'Osmani Intl' },
  { code: 'RJH', city: 'Rajshahi', name: 'Shah Makhdum Airport' },
  { code: 'SPD', city: 'Saidpur', name: 'Saidpur Airport' },
  { code: 'BZL', city: 'Barisal', name: 'Barisal Airport' },
  { code: 'JSR', city: 'Jashore', name: 'Jashore Airport' },
];

export const AIRLINES: Airline[] = [
  { name: 'Biman Bangladesh', logo: 'https://picsum.photos/seed/biman/40/40' },
  { name: 'US-Bangla', logo: 'https://picsum.photos/seed/usbangla/40/40' },
  { name: 'Novoair', logo: 'https://picsum.photos/seed/novo/40/40' },
  { name: 'Air Astra', logo: 'https://picsum.photos/seed/astra/40/40' },
  { name: 'Emirates', logo: 'https://picsum.photos/seed/emirates/40/40' },
  { name: 'Singapore Air', logo: 'https://picsum.photos/seed/singapore/40/40' },
];

export const AIRLINE_OPTIONS = [
  { code: 'BS', name: 'US-Bangla Airlines' },
  { code: 'TG', name: 'Thai Airways' },
  { code: 'PG', name: 'Bangkok Airways' },
];