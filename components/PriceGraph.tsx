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
    // Filter to only show airlines that have data (non-null values) at this point
    const activePayloads = payload.filter((p: any) => p.value !== null && p.value !== undefined);

    if (activePayloads.length === 0) return null;

    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 min-w-[160px]">
        <p className="text-gray-500 text-xs font-semibold mb-2">{data.fullDateTime}</p>
        {activePayloads.map((item: any, index: number) => (
          <div key={item.name} className={index > 0 ? 'mt-2 pt-2 border-t border-gray-100' : ''}>
            <p className="font-bold text-sm mb-1" style={{ color: item.stroke }}>
              {item.name}
            </p>
            <p className="text-base font-bold text-rose-600">
              BDT {item.value?.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const PriceGraph: React.FC<PriceGraphProps> = ({ flights }) => {
  if (!flights || flights.length === 0) return null;

  try {
    const timeMap = new Map<string, any>();
    
    flights.forEach(flight => {
      const depTime = flight.departureTime;
      const [datePart, timePart] = depTime.split('T');
      const [year, month, day] = datePart.split('-');
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthName = monthNames[parseInt(month) - 1];
      
      const [hour, minute] = timePart.split(':');
      const hourNum = parseInt(hour);
      const ampm = hourNum >= 12 ? 'PM' : 'AM';
      const hour12 = hourNum % 12 || 12;
      const time = `${hour12.toString().padStart(2, '0')}:${minute} ${ampm}`;
      
      const date = `${monthName} ${parseInt(day)}, ${year}`;
      const fullDateTime = `${monthName} ${parseInt(day)}, ${year} ${time}`;
      const sortKey = new Date(depTime).getTime();
      
      if (!timeMap.has(depTime)) {
        timeMap.set(depTime, { dateTime: time, date, sortKey, fullDateTime });
      }
      
      const timeData = timeMap.get(depTime);
      timeData[flight.airline.name] = flight.price;
    });

    const chartData = Array.from(timeMap.values()).sort((a: any, b: any) => a.sortKey - b.sortKey);
    const airlines = [...new Set(flights.map(f => f.airline.name))];
    const allPrices = flights.map(f => f.price);
    const minPrice = Math.floor(Math.min(...allPrices) / 1000) * 1000;
    const maxPrice = Math.ceil(Math.max(...allPrices) / 1000) * 1000;

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 focus:outline-none" tabIndex={-1}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Price Trend by Airline</h3>
            <p className="text-sm text-gray-500">Compare ticket prices across different airlines over time</p>
          </div>
        </div>
        
        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, bottom: 80, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis 
                  dataKey="dateTime" 
                  tick={{ fontSize: 12, fill: '#1f2937', fontWeight: 500 }} 
                  height={70}
              />
              <XAxis 
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  xAxisId="date"
                  height={70}
                  dy={20}
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
