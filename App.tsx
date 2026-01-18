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
  from: AIRPORTS[0], // Dhaka
  to: AIRPORTS[1],   // Cox's Bazar
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
  const [sortOrder, setSortOrder] = useState<'price-asc' | 'price-desc'>('price-asc');

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

  // Sort flights based on current sortOrder
  const sortedFlights = [...flights].sort((a, b) => {
    if (sortOrder === 'price-asc') return a.price - b.price;
    if (sortOrder === 'price-desc') return b.price - a.price;
    return 0;
  });

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
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Sidebar */}
            <div className="hidden lg:block lg:col-span-3 space-y-6">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm sticky top-24">
                    <h3 className="font-bold text-gray-800 mb-4">Sort By Price</h3>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="sort"
                                checked={sortOrder === 'price-asc'}
                                onChange={() => setSortOrder('price-asc')}
                                className="w-4 h-4"
                            />
                            <span className="text-gray-700">Low to High</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="sort"
                                checked={sortOrder === 'price-desc'}
                                onChange={() => setSortOrder('price-desc')}
                                className="w-4 h-4"
                            />
                            <span className="text-gray-700">High to Low</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Right Content (Graph & List) */}
            <div className="lg:col-span-9">
                {searched && !loading && sortedFlights.length > 0 && (
                    <PriceGraph flights={sortedFlights} />
                )}
                
                <FlightList flights={sortedFlights} loading={loading} />
            </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-400 text-sm">© 2024 FareComparison. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;