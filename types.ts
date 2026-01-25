export interface Airport {
  code: string;
  city: string;
  name: string;
}

export interface Airline {
  name: string;
  logo: string; // URL to placeholder
}

export interface Flight {
  id: string;
  airline: Airline;
  flightNumber: string;
  departureTime: string; // ISO string
  arrivalTime: string; // ISO string
  origin: string;
  destination: string;
  price: number;
  stops: number;
  duration: string;
  loadFactor: number;
}

export interface SearchParams {
  airlines: string[];
  from: Airport;
  to: Airport;
  startDate: string;
  endDate: string;
  tripType: 'one-way' | 'round-trip' | 'multi-city';
  passengers: number;
  class: 'economy' | 'business' | 'first';
}

export interface PricePoint {
  time: string;
  price: number;
  airline: string;
}