'use client';

import { useEffect, useState } from 'react';
import { analyticsAPI, SalesSummary } from '@/lib/api';
import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react';

export default function Dashboard() {
    const [summary, setSummary] = useState<SalesSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        const fetchData = async () => {
            try {
                const data = await analyticsAPI.getSalesSummary();
                setSummary(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify0center h-64">
                <div className="text-lg">Carregando dados...</div>
            </div>
        );
    }

    return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        MegaBite Analytics
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Métricas */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Vendas</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary?.total_sales.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Faturamento Total</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {summary?.total_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {summary?.avg_ticket.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Status</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary?.data_available ? 'Ativo' : 'Configurando'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {!summary?.data_available && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            ⚠️ Aguardando geração completa dos dados. O data-generator está criando ~500.000 vendas...
          </p>
        </div>
      )}
    </div>
  );
}