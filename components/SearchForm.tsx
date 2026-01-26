import React, { useState, useEffect } from 'react';
import { SearchParams, Airport } from '../types';
import { AIRLINE_OPTIONS } from '../constants';
import { routeService } from '../services/routeService';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  initialParams: SearchParams;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, initialParams }) => {
  const [params, setParams] = useState<SearchParams>(initialParams);
  const [showAirlines, setShowAirlines] = useState(false);
  const [airports, setAirports] = useState<Airport[]>([]);
  const airlineRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAirports();
  }, []);

  const loadAirports = async () => {
    try {
      const data = await routeService.getUniqueAirports();
      setAirports(data);
      if (data.length > 0 && !params.from.code) {
        setParams(prev => ({ ...prev, from: data[0], to: data[1] || data[0] }));
      }
    } catch (error) {
      console.error('Failed to load airports:', error);
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (airlineRef.current && !airlineRef.current.contains(event.target as Node)) {
        setShowAirlines(false);
      }
    };

    if (showAirlines) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAirlines]);

  const handleAirportChange = (type: 'from' | 'to', code: string) => {
    const airport = airports.find(a => a.code === code);
    if (airport) {
      setParams(prev => ({ ...prev, [type]: airport }));
    }
  };

  const swapAirports = () => {
    setParams(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  const toggleAirline = (code: string) => {
    setParams(prev => ({
      ...prev,
      airlines: prev.airlines.includes(code)
        ? prev.airlines.filter(a => a !== code)
        : [...prev.airlines, code]
    }));
  };

  const handleSearch = () => {
    onSearch(params);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 relative mb-8 z-20 mx-4 lg:mx-auto max-w-6xl border border-gray-100" style={{ marginTop: '-8rem' }}>
      
      {/* Main Inputs Grid */}
      <div className="flex items-center gap-4 mb-6">
        {/* Airline Name */}
        <div ref={airlineRef} className="flex-1 border border-gray-200 rounded-lg p-3 hover:border-rose-300 transition-colors bg-white cursor-pointer relative"
             onClick={() => setShowAirlines(!showAirlines)}>
          <label className="block text-xs text-gray-400 uppercase font-semibold mb-1">Airline Name</label>
          <div className="font-bold text-gray-800 text-lg">
            {params.airlines.length === 0 ? 'All Airlines' : `${params.airlines.length} Selected`}
          </div>
          <p className="text-xs text-gray-500">Select airlines</p>
          
          {showAirlines && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 p-4 w-64 z-50" onClick={(e) => e.stopPropagation()}>
              {AIRLINE_OPTIONS.map(airline => (
                <label key={airline.code} className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded px-2">
                  <input
                    type="checkbox"
                    checked={params.airlines.includes(airline.code)}
                    onChange={() => toggleAirline(airline.code)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{airline.name} ({airline.code})</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* From */}
        <div className="flex-1 border border-gray-200 rounded-lg p-3 hover:border-rose-300 transition-colors bg-white">
          <label className="block text-xs text-gray-400 uppercase font-semibold mb-1">From</label>
          <select 
            className="w-full font-bold text-gray-800 outline-none bg-transparent appearance-none cursor-pointer text-lg"
            style={{
              borderRadius: '0.75rem',
              padding: '0.25rem'
            }}
            value={params.from.code}
            onChange={(e) => handleAirportChange('from', e.target.value)}
          >
            {airports.map(a => <option key={a.code} value={a.code} style={{ borderRadius: '0.5rem', padding: '0.5rem', color: '#4b5563' }}>{a.code}</option>)}
          </select>
          <p className="text-xs text-gray-500 truncate">{params.from.code}</p>
        </div>

        {/* Swap Button */}
        <button 
          onClick={swapAirports}
          className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center shadow-md hover:bg-rose-700 text-white transition-all mt-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>

        {/* To */}
        <div className="flex-1 border border-gray-200 rounded-lg p-3 hover:border-rose-300 transition-colors bg-white">
          <label className="block text-xs text-gray-400 uppercase font-semibold mb-1">To</label>
          <select 
            className="w-full font-bold text-gray-800 outline-none bg-transparent appearance-none cursor-pointer text-lg"
            style={{
              borderRadius: '0.75rem',
              padding: '0.25rem'
            }}
            value={params.to.code}
            onChange={(e) => handleAirportChange('to', e.target.value)}
          >
            {airports.map(a => <option key={a.code} value={a.code} style={{ borderRadius: '0.5rem', padding: '0.5rem', color: '#4b5563' }}>{a.code}</option>)}
          </select>
          <p className="text-xs text-gray-500 truncate">{params.to.code}</p>
        </div>

        {/* Start Date */}
        <div className="flex-1 border border-gray-200 rounded-lg p-3 hover:border-rose-300 transition-colors bg-white">
          <label className="block text-xs text-gray-400 uppercase font-semibold mb-1">Start Date</label>
          <input 
            type="date"
            className="w-full font-bold text-gray-800 outline-none bg-transparent"
            value={params.startDate}
            onChange={(e) => setParams({...params, startDate: e.target.value})}
          />
          <p className="text-xs text-gray-500 mt-1">{new Date(params.startDate).toLocaleDateString('en-US', {weekday: 'long'})}</p>
        </div>

        {/* End Date */}
        <div className="flex-1 border border-gray-200 rounded-lg p-3 hover:border-rose-300 transition-colors bg-white">
          <label className="block text-xs text-gray-400 uppercase font-semibold mb-1">End Date</label>
          <input 
            type="date"
            className="w-full font-bold text-gray-800 outline-none bg-transparent"
            value={params.endDate}
            onChange={(e) => setParams({...params, endDate: e.target.value})}
          />
          <p className="text-xs text-gray-500 mt-1">{new Date(params.endDate).toLocaleDateString('en-US', {weekday: 'long'})}</p>
        </div>

        {/* Search Button */}
        <button 
            onClick={handleSearch}
            className="w-16 h-16 bg-rose-600 text-white rounded-lg font-bold shadow-lg hover:bg-rose-700 transition-all flex items-center justify-center mt-4"
        >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchForm;