import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CalculationResult, Membership } from '../types';

interface ComparisonChartProps {
  results: CalculationResult[];
  memberships: Membership[];
  dataKey: 'totalPrice' | 'totalPV' | 'totalBV';
  title: string;
  color: string;
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ results, memberships, dataKey, title, color }) => {
  const data = results.map(r => {
    const mem = memberships.find(m => m.id === r.membershipId);
    return {
      name: mem ? mem.name : r.membershipId,
      value: r[dataKey],
      color: mem ? mem.color.split(' ')[0].replace('bg-', '') : 'gray', 
    };
  });

  return (
    <div className="h-64 lg:h-72 w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col">
      <h3 className="text-xs lg:text-sm font-semibold text-slate-800 mb-4 truncate">{title}</h3>
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{fill: '#64748b', fontSize: 11}} 
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis 
              tick={{fill: '#64748b', fontSize: 11}} 
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => value > 999 ? `${(value/1000).toFixed(1)}k` : value}
            />
            <Tooltip 
              wrapperStyle={{ zIndex: 100 }}
              contentStyle={{ 
                backgroundColor: '#fff', 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                padding: '8px 12px'
              }}
              cursor={{ fill: '#f8fafc' }}
              formatter={(value: number) => [value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), title]}
              labelStyle={{ color: '#475569', fontWeight: 600, marginBottom: '4px', fontSize: '12px' }}
              itemStyle={{ fontSize: '12px', padding: 0 }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} fill={color} maxBarSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComparisonChart;
