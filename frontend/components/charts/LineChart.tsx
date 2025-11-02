'use client';

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SalesTrendData } from '@/lib/api';

interface LineChartProps {
  data: SalesTrendData[];
  period: string;
  height?: number;
}

export default function LineChart({ data, period, height = 300 }: LineChartProps) {
  // Formatar números para exibição
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `R$ ${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `R$ ${(num / 1000).toFixed(0)}K`;
    }
    return `R$ ${num.toFixed(0)}`;
  };

  const formatSales = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };

  return (
    <div className="bg-bg-card rounded-dish p-6 border border-bg-tertiary">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-text-primary">
          Tendência de Vendas - {period === '7d' ? '7 Dias' : period === '30d' ? '30 Dias' : '90 Dias'}
        </h3>
        <div className="text-sm text-text-secondary">
          Total: {data.reduce((sum, item) => sum + item.sales, 0).toLocaleString()} vendas
        </div>
      </div>
      
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#374151" 
              opacity={0.3}
            />
            <XAxis 
              dataKey="date" 
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#374151' }}
            />
            <YAxis 
              yAxisId="left"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#374151' }}
              tickFormatter={formatSales}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#374151' }}
              tickFormatter={formatNumber}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#f8fafc'
              }}
              formatter={(value: number, name: string) => {
                if (name === 'Vendas') return [value.toLocaleString(), name];
                if (name === 'Receita') return [formatNumber(value), name];
                return [value, name];
              }}
              labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
            />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="sales" 
              name="Vendas"
              stroke="#ec4899" 
              strokeWidth={2}
              dot={{ fill: '#ec4899', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 6, fill: '#db2777' }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="revenue" 
              name="Receita"
              stroke="#10b981" 
              strokeWidth={2}
              strokeDasharray="3 3"
              dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 6, fill: '#059669' }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-bg-tertiary">
        <div className="text-center">
          <div className="text-sm text-text-secondary">Vendas/Dia</div>
          <div className="text-lg font-semibold text-text-primary">
            {Math.round(data.reduce((sum, item) => sum + item.sales, 0) / data.length).toLocaleString()}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-text-secondary">Receita/Dia</div>
          <div className="text-lg font-semibold text-text-primary">
            {formatNumber(data.reduce((sum, item) => sum + item.revenue, 0) / data.length)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-text-secondary">Ticket Médio</div>
          <div className="text-lg font-semibold text-text-primary">
            R$ {Math.round(data.reduce((sum, item) => sum + item.avg_ticket, 0) / data.length).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}