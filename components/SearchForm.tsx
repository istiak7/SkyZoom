import React, { useState } from 'react';
import { SearchParams, Airport } from '../types';
import { AIRPORTS } from '../constants';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  initialParams: SearchParams;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, initialParams }) => {
  const [params, setParams] = useState<SearchParams>(initialParams);
  const [showTravelers, setShowTravelers] = useState(false);

  const handleAirportChange = (type: 'from' | 'to', code: string) => {
    const airport = AIRPORTS.find(a => a.code === code);
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

  const handleSearch = () => {
    onSearch(params);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 relative -mt-24 mb-8 z-20 mx-4 lg:mx-auto max-w-6xl border border-gray-100">
      
      {/* Main Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 relative">
        {/* From */}
        <div className="md:col-span-3 border border-gray-200 rounded-lg p-3 hover:border-rose-300 transition-colors bg-white relative group">
          <label className="block text-xs text-gray-400 uppercase font-semibold mb-1">From</label>
          <select 
            className="w-full font-bold text-gray-800 outline-none bg-transparent appearance-none cursor-pointer text-lg"
            value={params.from.code}
            onChange={(e) => handleAirportChange('from', e.target.value)}
          >
            {AIRPORTS.map(a => <option key={a.code} value={a.code}>{a.city} ({a.code})</option>)}
          </select>
          <p className="text-xs text-gray-500 truncate">{params.from.name}</p>
        </div>

        {/* Swap Button (Absolute Positioned) */}
        <div className="hidden md:flex absolute left-[25%] top-1/2 -translate-y-1/2 -translate-x-1/2 z-10">
          <button 
            onClick={swapAirports}
            className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:bg-rose-50 hover:border-rose-200 text-rose-600 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
        </div>

        {/* To */}
        <div className="md:col-span-3 border border-gray-200 rounded-lg p-3 hover:border-rose-300 transition-colors bg-white md:pl-6">
          <label className="block text-xs text-gray-400 uppercase font-semibold mb-1">To</label>
          <select 
            className="w-full font-bold text-gray-800 outline-none bg-transparent appearance-none cursor-pointer text-lg"
            value={params.to.code}
            onChange={(e) => handleAirportChange('to', e.target.value)}
          >
            {AIRPORTS.map(a => <option key={a.code} value={a.code}>{a.city} ({a.code})</option>)}
          </select>
          <p className="text-xs text-gray-500 truncate">{params.to.name}</p>
        </div>

        {/* Departure */}
        <div className="md:col-span-3 border border-gray-200 rounded-lg p-3 hover:border-rose-300 transition-colors bg-white">
          <label className="block text-xs text-gray-400 uppercase font-semibold mb-1">Departure</label>
          <input 
            type="date"
            className="w-full font-bold text-gray-800 outline-none bg-transparent"
            value={params.departureDate}
            onChange={(e) => setParams({...params, departureDate: e.target.value})}
          />
          <p className="text-xs text-gray-500 mt-1">Select Date</p>
        </div>

        {/* Travelers */}
        <div className="md:col-span-3 border border-gray-200 rounded-lg p-3 hover:border-rose-300 transition-colors bg-white cursor-pointer relative"
             onClick={() => setShowTravelers(!showTravelers)}>
          <label className="block text-xs text-gray-400 uppercase font-semibold mb-1">Travelers</label>
          <div className="font-bold text-gray-800 text-lg">{params.passengers} Traveler</div>
          <p className="text-xs text-gray-500">Add travelers</p>
          
          {showTravelers && (
            <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 p-4 w-64 z-50" onClick={(e) => e.stopPropagation()}>
               <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Passengers</span>
                  <div className="flex items-center gap-3">
                     <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold" onClick={() => setParams(p => ({...p, passengers: Math.max(1, p.passengers - 1)}))}>-</button>
                     <span className="font-bold">{params.passengers}</span>
                     <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold" onClick={() => setParams(p => ({...p, passengers: Math.min(9, p.passengers + 1)}))}>+</button>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer/Search Button */}
      <div className="flex justify-end mt-4">
        <button 
            onClick={handleSearch}
            className="w-full md:w-auto bg-rose-600 text-white px-12 py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-rose-700 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
        </button>
      </div>
    </div>
  );
};

export default SearchForm;