import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ZAxis
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
  'Air Astra': '#9f798c',
  'Emirates': '#06b6d9',
  'Singapore Air': '#ed3acc'
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 min-w-[280px] overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
          <div className="text-gray-900 font-bold text-sm">
            {data.formattedDate}
          </div>
          <div className="text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
            {data.formattedTime}
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: AIRLINE_COLORS[data.airline] }} />
            <span className="text-sm font-bold text-gray-700">
              {data.airline}
            </span>
          </div>
          <div className="pl-5 text-sm flex justify-between">
            <div>
              <span className="text-gray-500">{data.flightNumber}</span>
              <span className="font-bold text-gray-900 ml-4">BDT {data.y.toLocaleString()}</span>
            </div>
            <span className="text-gray-500 text-right">LF {data.loadFactor.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const PriceGraph: React.FC<PriceGraphProps> = ({ flights }) => {
  if (!flights || flights.length === 0) return null;

  try {
    // Get unique times and assign index positions
    const uniqueTimes = [...new Set(flights.map(f => f.departureTime))].sort();
    const timeToIndex = new Map(uniqueTimes.map((time, idx) => [time, idx]));
    
    const scatterData = flights.map(flight => {
      const departure = new Date(flight.departureTime);
      const [hour, minute] = [departure.getHours(), departure.getMinutes()];
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      const timeStr = `${hour12.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`;
      
      return {
        x: timeToIndex.get(flight.departureTime)!,
        y: flight.price,
        airline: flight.airline.name,
        flightNumber: flight.flightNumber,
        loadFactor: flight.loadFactor,
        formattedTime: timeStr,
        formattedDate: departure.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
      }
    });

    const airlines = [...new Set(flights.map(f => f.airline.name))];
    const allPrices = flights.map(f => f.price);
    const minPrice = Math.floor(Math.min(...allPrices) / 1000) * 1000;
    const maxPrice = Math.ceil(Math.max(...allPrices) / 1000) * 1000;
    
    // Create tick labels for X-axis with smart spacing
    const totalTimes = uniqueTimes.length;
    let tickInterval = 1;
    
    // Calculate interval based on number of times to prevent overlap
    if (totalTimes > 20) tickInterval = 4;
    else if (totalTimes > 15) tickInterval = 3;
    else if (totalTimes > 10) tickInterval = 2;
    
    const xTicks = uniqueTimes.map((_, idx) => idx).filter((idx) => idx % tickInterval === 0);
    
    const xTickLabels = uniqueTimes.map((time: string, idx) => {
      const d = new Date(time);
      const [hour, minute] = [d.getHours(), d.getMinutes()];
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      const timeStr = `${hour12.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`;
      const dateStr = d.toLocaleDateString([], { day: 'numeric', month: 'short' });
      
      // Show date only if it's different from previous
      let showDate = false;
      if (idx === 0) {
        showDate = true;
      } else {
        const prevTime = uniqueTimes[idx - 1] as string;
        const prevDate = new Date(prevTime).toDateString();
        const currDate = d.toDateString();
        showDate = prevDate !== currDate;
      }
      
      // Only show time if it's in the tick interval
      const showTime = idx % tickInterval === 0;
      
      return { time: showTime ? timeStr : '', date: showDate ? dateStr : '' };
    });

    const CustomXAxisTick = (props: any) => {
      const { x, y, payload } = props;
      const label = xTickLabels[payload.value];
      if (!label || !label.time) return null;
      
      return (
        <g transform={`translate(${x},${y})`}>
          <text x={0} y={0} dy={16} textAnchor="middle" fill="#111827" fontSize={12} fontWeight={600}>
            {label.time}
          </text>
          {label.date && (
            <text x={0} y={0} dy={32} textAnchor="middle" fill="#6b7280" fontSize={12} fontWeight={500}>
              {label.date}
            </text>
          )}
        </g>
      );
    };

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 focus:outline-none" tabIndex={-1}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Cheap Flight Comparison</h3>
            <p className="text-sm text-gray-500">Compare ticket prices across different airlines over time</p>
          </div>
        </div>
        
        <div className="h-[600px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 30, bottom: 80, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis 
                type="number" 
                dataKey="x" 
                domain={[0, uniqueTimes.length - 1]}
                ticks={xTicks}
                tick={<CustomXAxisTick />}
                height={70}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="price" 
                domain={[minPrice, maxPrice]} 
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickFormatter={(value) => `৳${(value/1000).toFixed(0)}k`}
                />
              <ZAxis dataKey="z" range={[100, 100]} />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              <Legend 
                wrapperStyle={{ fontSize: '13px', paddingTop: '10px', position: 'relative', top: '-20px' }} 
                iconType="circle"
                verticalAlign="top"
              />
              
              {airlines.map((airline: string) => {
                const airlineData = scatterData
                  .filter(d => d.airline === airline)
                  .sort((a, b) => a.x - b.x);
                
                return (
                  <Scatter 
                    key={airline}
                    name={airline}
                    data={airlineData} 
                    fill={AIRLINE_COLORS[airline] || '#6b7280'}
                    line={{ stroke: AIRLINE_COLORS[airline] || '#6b7280', strokeWidth: 2 }}
                  />
                );
              })}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Graph error:', error);
    return null;
  }
};

// Demo component with sample data
export default PriceGraph;