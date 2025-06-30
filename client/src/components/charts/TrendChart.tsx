"use client";

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TrendData {
  timestamp: string;
  attacks: number;
  cpu: number;
  memory: number;
  throughput: number;
}

export const TrendChart: React.FC = () => {
  const [data, setData] = useState<TrendData[]>([]);
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('6h');

  useEffect(() => {
    // Simular dados históricos - em produção, viria da API
    const generateMockData = () => {
      const now = new Date();
      const points = timeRange === '1h' ? 12 : timeRange === '6h' ? 36 : timeRange === '24h' ? 48 : 168;
      const interval = timeRange === '1h' ? 5 : timeRange === '6h' ? 10 : timeRange === '24h' ? 30 : 60;

      const mockData: TrendData[] = [];
      
      for (let i = points; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - (i * interval * 60000));
        mockData.push({
          timestamp: timestamp.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit',
            ...(timeRange === '7d' && { day: '2-digit', month: '2-digit' })
          }),
          attacks: Math.floor(Math.random() * 1000) + 100,
          cpu: Math.floor(Math.random() * 40) + 30,
          memory: Math.floor(Math.random() * 30) + 40,
          throughput: Math.floor(Math.random() * 500) + 100
        });
      }
      
      setData(mockData);
    };

    generateMockData();
    const interval = setInterval(generateMockData, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [timeRange]);

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Tendências Temporais</h2>
        <div className="flex space-x-2">
          {(['1h', '6h', '24h', '7d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="timestamp" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="attacks" 
              stroke="#EF4444" 
              strokeWidth={2}
              name="Ataques"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="cpu" 
              stroke="#3B82F6" 
              strokeWidth={2}
              name="CPU %"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="memory" 
              stroke="#10B981" 
              strokeWidth={2}
              name="Memória %"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="throughput" 
              stroke="#F59E0B" 
              strokeWidth={2}
              name="Throughput (Mbps)"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;