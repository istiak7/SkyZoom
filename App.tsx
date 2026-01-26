import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchForm from './components/SearchForm';
import FlightList from './components/FlightList';
import PriceGraph from './components/PriceGraph';
import { RoutesConfig } from './components/RoutesConfig';
import { Login } from './components/Login';
import { flightService } from './services/flightService';
import { routeService } from './services/routeService';
import { SearchParams, Flight, Airport, UserResponse } from './types';

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showRoutingConfig, setShowRoutingConfig] = useState(false);

  useEffect(() => {
    setShowRoutingConfig(location.pathname === '/routing-config');
  }, [location]);
  const [initialParams, setInitialParams] = useState<SearchParams | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('skyzoom_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('skyzoom_user');
      }
    }
    setIsAuthChecking(false);
  }, []);

  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  const handleLoginSuccess = (loggedInUser: UserResponse) => {
    setUser(loggedInUser);
    localStorage.setItem('skyzoom_user', JSON.stringify(loggedInUser));
    navigate('/');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('skyzoom_user');
    localStorage.removeItem('skyzoom_token');
    localStorage.removeItem('skyzoom_refresh');
    setFlights([]);
    setSearched(false);
    navigate('/login');
  };

  const loadInitialData = async () => {
    try {
      const airports = await routeService.getUniqueAirports();
      const dacAirport = airports.find(a => a.code === 'DAC') || airports[0];
      const cxbAirport = airports.find(a => a.code === 'CXB') || airports[1];
      
      const params: SearchParams = {
        airlines: ['BS'],
        from: dacAirport,
        to: cxbAirport,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tripType: 'one-way',
        passengers: 1,
        class: 'economy'
      };
      setInitialParams(params);
      handleSearch(params);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

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

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (!initialParams) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (showRoutingConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar onMenuClick={() => navigate('/')} showRoutingConfig={true} user={user} onLogout={handleLogout} />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <RoutesConfig />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onMenuClick={() => navigate('/routing-config')} showRoutingConfig={false} user={user} onLogout={handleLogout} />

      {/* Hero Section - Reduced height */}
      <div className="relative h-[400px] w-full bg-gray-900 overflow-hidden">
        <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop" 
            alt="Aerial view of beach" 
            className="w-full h-full object-cover opacity-60"
            style={{ objectPosition: '50% 50%' }}
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
        <SearchForm onSearch={handleSearch} initialParams={initialParams} />

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