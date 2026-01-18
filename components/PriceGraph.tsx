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
  'US-Bangla Airlines': '#3b82f6',
  'Thai Airways': '#ef4444',
  'Bangkok Airways': '#22c55e',
  'Novoair': '#f59e0b',
  'Biman Bangladesh': '#8b5cf6',
  'Air Astra': '#ec4899',
  'Emirates': '#d97706',
  'Singapore Air': '#7c3aed'
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const airlineName = payload[0].name;
    const price = payload[0].value;

    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 min-w-[140px]">
        <p className="text-gray-500 text-xs font-semibold mb-1">{data.dateTime}</p>
        <p className="font-bold text-gray-800 text-sm mb-1">{airlineName}</p>
        <p className="text-base font-bold text-rose-600">
          BDT {price?.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const PriceGraph: React.FC<PriceGraphProps> = ({ flights }) => {
  if (!flights || flights.length === 0) return null;

  try {
    const dataByDateTime = flights.reduce((acc, flight) => {
      const dateObj = new Date(flight.departureTime);
      const date = dateObj.toLocaleDateString();
      const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const key = `${date} ${time}`;
      const sortKey = dateObj.getTime();
      
      if (!acc[key]) {
        acc[key] = { dateTime: key, sortKey };
      }
      acc[key][flight.airline.name] = flight.price;
      
      return acc;
    }, {} as Record<string, any>);

    const chartData = Object.values(dataByDateTime).sort((a: any, b: any) => a.sortKey - b.sortKey);
    const airlines = [...new Set(flights.map(f => f.airline.name))];
    const allPrices = flights.map(f => f.price);
    const minPrice = Math.floor(Math.min(...allPrices) / 1000) * 1000;
    const maxPrice = Math.ceil(Math.max(...allPrices) / 1000) * 1000;

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Price Trend by Airline</h3>
            <p className="text-sm text-gray-500">Compare ticket prices across different airlines over time</p>
          </div>
        </div>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, bottom: 60, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                  dataKey="dateTime" 
                  tick={{ fontSize: 13, fill: '#1f2937', fontWeight: 600 }} 
                  angle={-45}
                  textAnchor="end"
              />
              <YAxis 
                  domain={[minPrice, maxPrice]} 
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  tickFormatter={(value) => `৳${(value/1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '13px', paddingTop: '10px', position: 'relative', top: '-20px' }} 
                iconType="line" 
                verticalAlign="top"
              />
              
              {airlines.map((airline: string) => (
                <Line 
                  key={airline}
                  type="monotone" 
                  dataKey={airline} 
                  name={airline}
                  stroke={AIRLINE_COLORS[airline] || '#6b7280'} 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: AIRLINE_COLORS[airline] || '#6b7280' }}
                  activeDot={{ r: 7 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Graph error:', error);
    return null;
  }
};

export default PriceGraph;
