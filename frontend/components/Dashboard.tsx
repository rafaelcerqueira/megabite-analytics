'use client';

import { useEffect, useState } from 'react';
import { analyticsAPI, SalesSummary, SalesTrendData } from '@/lib/api';
import { DollarSign, ShoppingCart, Users, TrendingUp, Calendar, Utensils, Sparkles } from 'lucide-react';
import LineChart from './charts/LineChart';
import LoadingSpinner from './ui/LoadingSpinner';

export default function Dashboard() {
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [trendData, setTrendData] = useState<SalesTrendData[]>([]);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);

  const fetchData = async (newPeriod?: '7d' | '30d' | '90d') => {
    const selectedPeriod = newPeriod || period;
    
    if (newPeriod) {
      setChartLoading(true);
    }

    try {
      const [summaryData, trendData] = await Promise.all([
        analyticsAPI.getSalesSummary(),
        analyticsAPI.getSalesTrend(selectedPeriod)
      ]);
      setSummary(summaryData);
      setTrendData(trendData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setChartLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePeriodChange = (newPeriod: '7d' | '30d' | '90d') => {
    setPeriod(newPeriod);
    fetchData(newPeriod);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header Transparente e Fixo - MODIFICADO */}
      <header className="bg-bg-header/80 backdrop-blur-md border-b border-bg-tertiary/50 sticky top-0 z-50 shadow-2xl">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-berry shadow-lg">
                <Utensils className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">
                  MegaBite Analytics
                </h1>
                <p className="text-xs text-text-secondary">Dashboard Inteligente</p>
              </div>
            </div>
            
            {/* Seletor de Período Colorido - MANTIDO IGUAL */}
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-2xl p-1 border border-white/20 shadow-lg">
              {(['7d', '30d', '90d'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePeriodChange(p)}
                  className={`
                    relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer
                    overflow-hidden group
                    ${period === p
                      ? 'bg-white text-pink-600 shadow-2xl transform scale-105 font-bold'
                      : 'text-white bg-transparent hover:bg-white/20'
                    }
                    hover:scale-105 active:scale-95
                  `}
                  disabled={chartLoading}
                >
                  <span className="relative z-10 flex items-center gap-1">
                    {period === p && <Sparkles className="h-3 w-3" />}
                    {p === '7d' ? '7 Dias' : p === '30d' ? '30 Dias' : '90 Dias'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="p-6 space-y-8 pt-8">
        {/* Métricas Principais - Gradientes Muito Suaves */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 - Vendas (Rosa Muito Suave) */}
        <div className="bg-gradient-to-br from-pink-500/80 to-purple-500/80 rounded-2xl p-6 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-pink-50 mb-1">Total de Vendas</p>
              <p className="text-3xl font-bold text-white">
                {summary?.total_sales.toLocaleString() || 0}
              </p>
              <p className="text-xs text-pink-100 mt-1">↑ 12.5% este mês</p>
            </div>
            <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Card 2 - Faturamento (Verde Muito Suave) */}
        <div className="bg-gradient-to-br from-emerald-500/80 to-teal-500/80 rounded-2xl p-6 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-50 mb-1">Faturamento Total</p>
              <p className="text-3xl font-bold text-white">
                R$ {(summary?.total_revenue || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-emerald-100 mt-1">↑ 8.2% vs anterior</p>
            </div>
            <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Card 3 - Ticket Médio (Azul Muito Suave) */}
        <div className="bg-gradient-to-br from-blue-500/80 to-indigo-500/80 rounded-2xl p-6 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-50 mb-1">Ticket Médio</p>
              <p className="text-3xl font-bold text-white">
                R$ {(summary?.avg_ticket || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-blue-100 mt-1">↑ 3.1% esta semana</p>
            </div>
            <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Card 4 - Período (Laranja Muito Suave) */}
        <div className="bg-gradient-to-br from-amber-500/80 to-orange-500/80 rounded-2xl p-6 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-50 mb-1">Período Ativo</p>
              <p className="text-3xl font-bold text-white">
                {period === '7d' ? '7 Dias' : period === '30d' ? '30 Dias' : '90 Dias'}
              </p>
              <p className="text-xs text-amber-100 mt-1">Dados em tempo real</p>
            </div>
            <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

        {/* Gráfico de Tendência - Sem Borda Arredondada, Com Box-Shadow Centralizado - MODIFICADO */}
        {chartLoading ? (
          <div className="bg-gradient-berry rounded-2xl p-8 text-white shadow-2xl">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="bg-bg-card p-6 border border-bg-tertiary shadow-2xl hover:shadow-3xl transition-all duration-300">
            <LineChart data={trendData} period={period} height={400} />
          </div>
        )}
      </main>

      {/* Footer - MODIFICADO (Texto do desenvolvedor) */}
      <footer className="bg-gradient-berry border-t border-white/10 mt-12">
        <div className="px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>© {new Date().getFullYear()} MegaBite Analytics</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="font-semibold">
                Desenvolvido por Rafael Cerqueira
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-300 rounded-full"></div>
              <span>v1.0.0 • Sistema Online</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}