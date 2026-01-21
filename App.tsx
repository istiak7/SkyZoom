import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SearchForm from './components/SearchForm';
import FlightList from './components/FlightList';
import PriceGraph from './components/PriceGraph';
import { flightService } from './services/flightService';
import { SearchParams, Flight } from './types';
import { AIRPORTS } from './constants';

// Default initial state for the form
const initialSearchParams: SearchParams = {
  airlines: [],
  from: AIRPORTS[0], // Dhaka (DAC)
  to: AIRPORTS[1],   // Jeddah (JED)
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  tripType: 'one-way',
  passengers: 1,
  class: 'economy'
};

const App: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Automatically load some flights on mount for demonstration
  useEffect(() => {
    handleSearch(initialSearchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
    setSearched(true);
    try {
      const results = await flightService.search(params);
      setFlights(results);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter to show only minimum price flights per date/time/airline combination (like graph)
  const getMinimumPriceFlights = (flights: Flight[]): Flight[] => {
    const grouped = new Map<string, Flight>();
    
    flights.forEach(flight => {
      const key = `${flight.departureTime}-${flight.airline.name}`;
      const existing = grouped.get(key);
      
      if (!existing || flight.price < existing.price) {
        grouped.set(key, flight);
      }
    });
    
    return Array.from(grouped.values()).sort((a, b) => a.price - b.price);
  };

  const displayFlights = getMinimumPriceFlights(flights);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Hero Section - Reduced height */}
      <div className="relative h-[350px] w-full bg-gray-900 overflow-hidden">
        <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop" 
            alt="Aerial view of beach" 
            className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center pb-20">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-lg">Flight Price Comparison</h1>
            <p className="text-lg md:text-xl font-light opacity-90 drop-shadow-md">at your fingertips</p>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* Search Form (Overlapping Hero) */}
        <SearchForm onSearch={handleSearch} initialParams={initialSearchParams} />

        {/* Results Section */}
        <div className="mt-8">
            {searched && !loading && displayFlights.length > 0 && (
                <PriceGraph flights={displayFlights} />
            )}
            
            <FlightList flights={displayFlights} loading={loading} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-400 text-sm">© 2026 FareComparison. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;