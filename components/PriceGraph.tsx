import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Flight } from '../types';

interface PriceGraphProps {
  flights: Flight[];
}

const AIRLINE_COLORS: Record<string, string> = {
  'Novoair': '#ef4444',       // Red
  'US-Bangla': '#3b82f6',     // Blue
  'Air Astra': '#22c55e',     // Green
  'Biman Bangladesh': '#059669', // Emerald
  'Emirates': '#d97706',      // Amber
  'Singapore Air': '#7c3aed'  // Violet
};

// Custom Tooltip to show Time, Airline, and Price without altering graph design
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const airlineName = payload[0].name;
    const color = payload[0].color;

    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 min-w-[140px]">
        <p className="text-gray-500 text-xs font-semibold mb-1">{data.timeLabel}</p>
        <div className="flex items-center gap-2 mb-1">
           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
           <p className="font-bold text-gray-800 text-sm">{airlineName}</p>
        </div>
        <p className="text-base font-bold text-rose-600">
          BDT {data.price.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const PriceGraph: React.FC<PriceGraphProps> = ({ flights }) => {
  // Group flights by airline
  const flightsByAirline = flights.reduce((acc, flight) => {
    const name = flight.airline.name;
    if (!acc[name]) {
      acc[name] = [];
    }
    acc[name].push({
      timestamp: new Date(flight.departureTime).getTime(),
      price: flight.price,
      flightNum: flight.flightNumber,
      timeLabel: new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    return acc;
  }, {} as Record<string, any[]>);

  // Sort points in each group by time
  Object.keys(flightsByAirline).forEach(key => {
    flightsByAirline[key].sort((a, b) => a.timestamp - b.timestamp);
  });

  // Calculate overall min/max for axes to ensure all lines fit
  const allPrices = flights.map(f => f.price);
  const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
  const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 10000;
  
  const allTimestamps = flights.map(f => new Date(f.departureTime).getTime());
  const minTime = allTimestamps.length > 0 ? Math.min(...allTimestamps) : Date.now();
  const maxTime = allTimestamps.length > 0 ? Math.max(...allTimestamps) : Date.now();

  // Time formatter for X Axis
  const formatTime = (time: number) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Price Trend by Airline</h3>
          <p className="text-sm text-gray-500">Compare ticket prices across different airlines over time</p>
        </div>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart margin={{ top: 10, right: 30, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
                dataKey="timestamp" 
                type="number" 
                domain={[minTime - 3600000, maxTime + 3600000]} // Add 1 hour padding
                tickFormatter={formatTime}
                tick={{ fontSize: 11, fill: '#9ca3af' }} 
                axisLine={false}
                tickLine={false}
                scale="time"
            />
            <YAxis 
                domain={[minPrice - 1000, maxPrice + 1000]} 
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `৳${value/1000}k`}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="circle" />
            
            {Object.entries(flightsByAirline).map(([airline, data]) => (
              <Line 
                key={airline}
                data={data}
                type="linear" 
                dataKey="price" 
                name={airline}
                stroke={AIRLINE_COLORS[airline] || '#6b7280'} 
                strokeWidth={2} 
                dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: AIRLINE_COLORS[airline] || '#6b7280' }}
                activeDot={{ r: 6 }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceGraph;