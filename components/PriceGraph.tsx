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
  'Air Astra': '#9f798c',
  'Emirates': '#06b6d9',
  'Singapore Air': '#ed3acc'
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const pointData = payload[0].payload;
    
    const allFlights: Array<{ airlineName: string; color: string; price: number; flightNumber: string }> = [];
    
    payload.forEach((entry: any) => {
      const airlineName = entry.name;
      const color = entry.color;
      const flights = pointData.flights[airlineName];
      
      if (flights && flights.length > 0) {
        flights.forEach((f: any) => {
          allFlights.push({ airlineName, color, price: f.price, flightNumber: f.flightNumber });
        });
      }
    });
    
    if (allFlights.length === 0) return null;
    
    allFlights.sort((a, b) => a.price - b.price);
    
    if (allFlights.length === 1) {
      const { airlineName, price, color } = allFlights[0];
      return (
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 min-w-[220px]">
          <div className="text-gray-500 text-xs font-semibold mb-2">
            {pointData.formattedDate} {pointData.formattedTime}
          </div>
          <div className="text-gray-900 font-bold text-base mb-2" style={{ color }}>
            {airlineName}
          </div>
          <div className="text-2xl font-extrabold text-gray-900">
            BDT {price.toLocaleString()}
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 min-w-[280px] overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
          <div className="text-gray-900 font-bold text-sm">
            {pointData.formattedDate}
          </div>
          <div className="text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
            {pointData.formattedTime}
          </div>
        </div>
        
        <div className="p-3 space-y-3 max-h-[400px] overflow-y-auto pointer-events-auto">
          {Array.from(new Set(allFlights.map(f => f.airlineName))).map((airlineName, idx) => {
            const airlineFlights = allFlights.filter(f => f.airlineName === airlineName);
            const color = airlineFlights[0].color;
            
            return (
              <div key={idx} className={`${idx !== 0 ? 'pt-3 border-t border-dashed border-gray-100' : ''}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-sm font-bold text-gray-700">
                    {airlineName}
                  </span>
                </div>
                <div className="space-y-1 pl-5">
                  {airlineFlights.map((item, i) => (
                    <div key={i} className="text-sm flex">
                      <span className="text-gray-500">{item.flightNumber}</span>
                      <span className="font-bold text-gray-900 ml-4">BDT {item.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

const PriceGraph: React.FC<PriceGraphProps> = ({ flights }) => {
  if (!flights || flights.length === 0) return null;

  try {
    const dateGroups = new Map<string, any[]>();
    
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
      const timestamp = new Date(depTime).getTime();
      const key = `${datePart}-${timePart}`;
      const airlineName = flight.airline.name;
      
      if (!dateGroups.has(datePart)) {
        dateGroups.set(datePart, []);
      }
      
      let point = dateGroups.get(datePart)!.find(p => p.key === key);
      if (!point) {
        point = {
          key,
          timestamp,
          formattedDate: date,
          formattedTime: time,
          flights: {}
        };
        dateGroups.get(datePart)!.push(point);
      }
      
      if (!point.flights[airlineName]) {
        point.flights[airlineName] = [];
      }
      
      point.flights[airlineName].push({
        time,
        price: flight.price,
        flightNumber: flight.flightNumber
      });
      
      const minPrice = Math.min(...point.flights[airlineName].map((f: any) => f.price));
      point[airlineName] = minPrice;
    });
    
    const chartData: any[] = [];
    let xPosition = 0;
    
    Array.from(dateGroups.entries()).sort((a, b) => a[0].localeCompare(b[0])).forEach(([date, points]) => {
      points.sort((a, b) => a.timestamp - b.timestamp);
      const spacing = 100 / (points.length + 1);
      
      points.forEach((point, idx) => {
        chartData.push({
          ...point,
          xPosition: xPosition + spacing * (idx + 1)
        });
      });
      
      xPosition += 100;
    });
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
        
        <div className="h-[600px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, bottom: 80, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis 
                  dataKey="xPosition"
                  type="number"
                  domain={[0, 'dataMax']}
                  ticks={chartData.map(d => d.xPosition)}
                  tickFormatter={(xPos) => {
                    const point = chartData.find(d => d.xPosition === xPos);
                    return point ? point.formattedTime : '';
                  }}
                  tick={{ fontSize: 12, fill: '#111827', fontWeight: 600 }}
                  height={70}
              />
              <XAxis 
                  dataKey="xPosition"
                  type="number"
                  domain={[0, 'dataMax']}
                  ticks={chartData.map(d => d.xPosition)}
                  tickFormatter={(xPos) => {
                    const point = chartData.find(d => d.xPosition === xPos);
                    return point ? point.formattedDate : '';
                  }}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 500 }}
                  xAxisId="date"
                  height={70}
                  dy={35}
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
