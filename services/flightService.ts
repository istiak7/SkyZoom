import { Flight, SearchParams, Airline } from '../types';
import { AIRLINES } from '../constants';

// Helper to generate random flight data
const generateFlights = (params: SearchParams): Promise<Flight[]> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const results: Flight[] = [];
      const basePrice = 5000 + Math.random() * 5000; 

      // Generate 15-20 flights
      const count = 15 + Math.floor(Math.random() * 5);

      for (let i = 0; i < count; i++) {
        const airline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)];
        const hour = 6 + Math.floor(Math.random() * 16); // 6 AM to 10 PM
        const minute = Math.floor(Math.random() * 4) * 15;
        
        const depDate = new Date(params.departureDate);
        depDate.setHours(hour, minute, 0);
        
        const durationHours = 1 + Math.floor(Math.random() * 3);
        const arrDate = new Date(depDate);
        arrDate.setHours(hour + durationHours, minute + 30);

        // Price variation based on time and airline
        const priceVariation = Math.random() * 2000 - 1000;
        const finalPrice = Math.floor(basePrice + priceVariation);

        results.push({
          id: `FL-${Date.now()}-${i}`,
          airline,
          flightNumber: `${airline.name.substring(0, 2).toUpperCase()}${100 + i}`,
          departureTime: depDate.toISOString(),
          arrivalTime: arrDate.toISOString(),
          origin: params.from.code,
          destination: params.to.code,
          price: finalPrice,
          stops: Math.random() > 0.8 ? 1 : 0,
          duration: `${durationHours}h 30m`
        });
      }

      // Sort by price by default
      results.sort((a, b) => a.price - b.price);
      resolve(results);
    }, 1500);
  });
};

export const flightService = {
  search: generateFlights
};
