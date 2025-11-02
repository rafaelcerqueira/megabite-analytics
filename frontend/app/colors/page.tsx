'use client';

import { Utensils, Pizza, ChefHat, Coffee } from 'lucide-react';

export default function ColorsPage() {
  const colorGroups = [
    {
      name: 'Cores de Fundo (Dark Theme)',
      colors: [
        { name: 'bg-primary', value: '#0f0f0f', text: 'text-white' },
        { name: 'bg-secondary', value: '#1a1a1a', text: 'text-white' },
        { name: 'bg-tertiary', value: '#262626', text: 'text-white' },
        { name: 'bg-card', value: '#1f1f1f', text: 'text-white' },
      ]
    },
    {
      name: 'Cores de Texto',
      colors: [
        { name: 'text-primary', value: '#f8fafc', text: 'text-gray-900' },
        { name: 'text-secondary', value: '#94a3b8', text: 'text-gray-900' },
        { name: 'text-accent', value: '#ffffff', text: 'text-gray-900' },
      ]
    },
    {
      name: 'Rosa (Drinks/Sobremesas)',
      colors: [
        { name: 'accent-pink-400', value: '#f472b6', text: 'text-white' },
        { name: 'accent-pink-500', value: '#ec4899', text: 'text-white' },
        { name: 'accent-pink-600', value: '#db2777', text: 'text-white' },
      ]
    },
    {
      name: 'Lilás (Vinhos/Sofisticação)',
      colors: [
        { name: 'accent-purple-400', value: '#c084fc', text: 'text-white' },
        { name: 'accent-purple-500', value: '#a855f7', text: 'text-white' },
        { name: 'accent-purple-600', value: '#9333ea', text: 'text-white' },
      ]
    },
    {
      name: 'Verde (Ingredientes Frescos)',
      colors: [
        { name: 'accent-green-400', value: '#34d399', text: 'text-gray-900' },
        { name: 'accent-green-500', value: '#10b981', text: 'text-white' },
        { name: 'accent-green-600', value: '#059669', text: 'text-white' },
      ]
    },
    {
      name: 'Laranja (Calor/Cozinha)',
      colors: [
        { name: 'accent-orange-400', value: '#fdba74', text: 'text-gray-900' },
        { name: 'accent-orange-500', value: '#f97316', text: 'text-white' },
        { name: 'accent-orange-600', value: '#ea580c', text: 'text-white' },
      ]
    }
  ];

  const gradients = [
    { name: 'Gradient Berry', value: 'bg-gradient-berry' },
    { name: 'Gradient Citrus', value: 'bg-gradient-citrus' },
    { name: 'Gradient Mint', value: 'bg-gradient-mint' },
    { name: 'Gradient Kitchen', value: 'bg-gradient-kitchen' },
  ];

  const foodIcons = [
    { icon: Utensils, name: 'Utensils', color: 'text-accent-pink-500' },
    { icon: Pizza, name: 'Pizza', color: 'text-accent-orange-500' },
    { icon: ChefHat, name: 'ChefHat', color: 'text-accent-green-500' },
    { icon: Coffee, name: 'Coffee', color: 'text-accent-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-8" style={{ backgroundColor: '#212336'}}>
      {/* Header com identidade MegaBite */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          {foodIcons.map(({ icon: Icon, color }, index) => (
            <div key={index} className={`p-3 rounded-dish bg-bg-secondary ${color}`}>
              <Icon size={24} />
            </div>
          ))}
        </div>
        <h1 className="text-4xl font-bold bg-gradient-berry bg-clip-text text-transparent mb-2">
          MegaBite Design System
        </h1>
        <p className="text-text-secondary text-lg">
          Dark Theme Gastronômico - Analytics com Sabor
        </p>
      </div>

      {/* Gradientes */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-text-primary">Gradientes Saborosos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {gradients.map((gradient) => (
            <div key={gradient.name} className="text-center">
              <div 
                className={`w-full h-24 rounded-dish mb-3 flex items-center justify-center ${gradient.value}`}
              >
                <span className="font-semibold text-white drop-shadow-lg">
                  {gradient.name}
                </span>
              </div>
              <div className="text-sm text-text-secondary font-mono">
                {gradient.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cores */}
      <div className="space-y-12">
        {colorGroups.map((group) => (
          <section key={group.name}>
            <h2 className="text-2xl font-semibold mb-6 text-text-primary">
              {group.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {group.colors.map((color) => (
                <div key={color.name} className="text-center">
                  <div 
                    className="w-full h-20 rounded-dish shadow-kitchen mb-2 flex items-center justify-center border border-bg-tertiary"
                    style={{ backgroundColor: color.value }}
                  >
                    <span className={`text-sm font-medium px-2 py-1 rounded ${color.text} bg-black bg-opacity-30`}>
                      Amostra
                    </span>
                  </div>
                  <div className="text-sm font-medium text-text-primary">
                    {color.name}
                  </div>
                  <div className="text-xs text-text-secondary font-mono">
                    {color.value}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Exemplos de Componentes */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6 text-text-primary">
          Componentes Exemplo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card de Métrica */}
          <div className="bg-bg-card rounded-dish p-6 border border-bg-tertiary">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Vendas Hoje</h3>
              <div className="p-2 rounded-dish bg-accent-pink-500">
                <Utensils size={20} className="text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-text-accent mb-2">R$ 12.847</p>
            <p className="text-accent-green-500 text-sm">↑ 12% vs ontem</p>
          </div>

          {/* Card com Gradiente */}
          <div className="bg-gradient-berry rounded-dish p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Novos Clientes</h3>
              <ChefHat size={24} />
            </div>
            <p className="text-3xl font-bold mb-2">247</p>
            <p className="text-pink-200 text-sm">+34 esta semana</p>
          </div>

          {/* Card Simples */}
          <div className="bg-bg-secondary rounded-dish p-6 border border-bg-tertiary">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Ticket Médio</h3>
              <div className="p-2 rounded-dish bg-accent-orange-500">
                <Pizza size={20} className="text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-text-accent mb-2">R$ 45,90</p>
            <p className="text-text-secondary text-sm">Restaurantes Premium</p>
          </div>
        </div>
      </section>

      {/* Notas de Design */}
      <div className="mt-12 p-6 bg-bg-secondary rounded-dish border border-accent-purple-500 border-opacity-20">
        <h3 className="text-lg font-semibold text-text-primary mb-3">🎨 Notas do Design System</h3>
        <ul className="text-text-secondary space-y-2">
          <li>• <strong>Dark Theme</strong> para foco nos dados e conforto visual</li>
          <li>• <strong>Cores gastronômicas</strong> que remetem a ingredientes e sabores</li>
          <li>• <strong>Bordas arredondadas</strong> inspiradas em pratos e utensílios</li>
          <li>• <strong>Ícones temáticos</strong> para reforçar a identidade MegaBite</li>
          <li>• <strong>Gradientes vibrantes</strong> para destaques e calls-to-action</li>
        </ul>
      </div>
    </div>
  );
}