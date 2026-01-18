import { Flight, SearchParams } from '../types';
import { apiClient } from './apiClient';
import { AIRLINE_OPTIONS } from '../constants';

const searchFlights = async (params: SearchParams): Promise<Flight[]> => {
  try {
    const airlineNames = params.airlines.map(code => {
      const airline = AIRLINE_OPTIONS.find(a => a.code === code);
      return airline ? airline.name : code;
    });

    const { data } = await apiClient.post('/Search/GetFlightsData', {
      airlineName: airlineNames,
      origin: params.from.code,
      destination: params.to.code,
      startDate: params.startDate,
      endDate: params.endDate
    });

    console.log('API Response:', data);

    if (!data || data.length === 0) {
      console.log('No data returned');
      return [];
    }

    const mappedFlights = data.map((flight: any, index: number) => {
      console.log('Processing flight:', flight);
      const depDate = flight.departureDate;
      const depTime = flight.departureTime.split(' ')[1];
      const schTime = flight.scheduleTime.split(' ')[1];
      
      const mapped = {
        id: `${flight.airlineCode}-${flight.flightNumber}-${index}`,
        airline: {
          name: flight.airlineName,
          logo: `https://picsum.photos/seed/${flight.airlineCode}/40/40`
        },
        flightNumber: flight.flightNumber,
        departureTime: `${depDate}T${depTime}:00`,
        arrivalTime: `${depDate}T${schTime}:00`,
        origin: params.from.code,
        destination: params.to.code,
        price: flight.totalFare,
        stops: 0,
        duration: calculateDuration(depTime, schTime)
      };
      console.log('Mapped flight:', mapped);
      return mapped;
    }).sort((a: Flight, b: Flight) => a.price - b.price);
    
    console.log('Total mapped flights:', mappedFlights.length);
    return mappedFlights;
  } catch (error) {
    console.error('Flight search failed:', error);
    return [];
  }
};

const calculateDuration = (departure: string, arrival: string): string => {
  try {
    const depTime = departure.split(':');
    const arrTime = arrival.split(':');
    
    const depMinutes = parseInt(depTime[0]) * 60 + parseInt(depTime[1]);
    const arrMinutes = parseInt(arrTime[0]) * 60 + parseInt(arrTime[1]);
    
    let diff = arrMinutes - depMinutes;
    if (diff < 0) diff += 24 * 60;
    
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}h ${minutes}m`;
  } catch {
    return 'N/A';
  }
};

export const flightService = {
  search: searchFlights
};
