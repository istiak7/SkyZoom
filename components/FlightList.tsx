import React from 'react';
import { Flight } from '../types';

interface FlightListProps {
  flights: Flight[];
  loading: boolean;
}

const FlightList: React.FC<FlightListProps> = ({ flights, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="flex justify-between items-center">
              <div className="h-8 bg-gray-200 rounded w-16"></div>
              <div className="h-px bg-gray-200 flex-1 mx-4"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Available Flights ({flights.length})</h2>
      </div>
      
      {flights.map(flight => (
        <div key={flight.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Departure Date & Time */}
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-400">Departure:</p>
              <p className="font-bold text-gray-800">{new Date(flight.departureTime).toLocaleDateString()}</p>
              <p className="font-bold text-gray-800">
                {new Date(flight.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>

            {/* Flight Times */}
            <div className="flex flex-1 items-center justify-center w-full">
              <div className="flex items-center gap-4">
                <img src={flight.airline.logo} alt={flight.airline.name} className="w-10 h-10 rounded-full object-cover bg-gray-50" />
                <div>
                  <p className="font-bold text-gray-800 text-sm">{flight.airline.name}</p>
                  {/* <p className="text-xs text-gray-400">{flight.flightNumber}</p> */}
                </div>
              </div>
              
              <div className="flex-1 flex flex-col items-center px-4">
                {/* <p className="text-xs text-gray-400 mb-1">{flight.duration}</p> */}
                <div className="w-full flex items-center">
                  <div className="h-[2px] bg-gray-200 flex-1"></div>
                  <div className="text-gray-300">✈</div>
                  <div className="h-[2px] bg-gray-200 flex-1"></div>
                </div>
                {/* <p className="text-xs text-rose-500 mt-1">{flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop`}</p> */}
              </div>

              <div className="w-full md:w-1/4 flex flex-col items-end border-t md:border-t-0 border-dashed border-gray-200 pt-4 md:pt-0 md:pl-6 mt-4 md:mt-0">
               <p className="text-xs text-gray-400 mb-1">Price per person</p>
               <p className="text-2xl font-bold text-rose-600 mb-2">BDT {flight.price.toLocaleString()}</p>
            
              </div>
              {/* <div className="text-center">
                <p className="font-bold text-lg text-gray-800">
                    {new Date(flight.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
                <p className="text-xs text-gray-500">{flight.destination}</p>
              </div> */}
            </div>

            {/* Price */}
            {/* <div className="w-full md:w-1/4 flex flex-col items-end border-t md:border-t-0 md:border-l border-dashed border-gray-200 pt-4 md:pt-0 md:pl-6 mt-4 md:mt-0">
               <p className="text-xs text-gray-400 mb-1">Price per person</p>
               <p className="text-2xl font-bold text-rose-600 mb-2">BDT {flight.price.toLocaleString()}</p>
            </div> */}
          </div>
        </div>
      ))}

      {flights.length === 0 && (
         <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <div className="text-6xl mb-4">✈️</div>
            <h3 className="text-xl font-bold text-gray-800">No flights found</h3>
            <p className="text-gray-500">Try changing your dates or airports.</p>
         </div>
      )}
    </div>
  );
};

export default FlightList;