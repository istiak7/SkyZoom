import { Flight, SearchParams } from '../types';

const searchFlights = async (params: SearchParams): Promise<Flight[]> => {
  try {
    const response = await fetch('https://localhost:7099/api/Search/GetFlightsPrice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Origin: params.from.code,
        Destination: params.to.code,
        DepartureDate: new Date(params.departureDate).toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    if (!data.flightDetails || data.flightDetails.length === 0) return [];

    return data.flightDetails.map((flight: any, index: number) => ({
      id: `FL-${Date.now()}-${index}`,
      airline: {
        name: flight.airlineName || 'Unknown',
        logo: `https://picsum.photos/seed/${flight.airlineName}/40/40`
      },
      flightNumber: `${flight.airlineName?.substring(0, 2).toUpperCase() || 'FL'}${100 + index}`,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      origin: data.origin,
      destination: data.destination,
      price: flight.fareAmount,
      stops: 0,
      duration: calculateDuration(flight.departureTime, flight.arrivalTime)
    })).sort((a: Flight, b: Flight) => a.price - b.price);
  } catch (error) {
    console.error('Flight search failed:', error);
    return [];
  }
};

const calculateDuration = (departure: string, arrival: string): string => {
  const diff = new Date(arrival).getTime() - new Date(departure).getTime();
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
};

export const flightService = {
  search: searchFlights
};
