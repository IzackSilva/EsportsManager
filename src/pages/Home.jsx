import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Navbar from '../components/Navbar'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function Home() {
  const [stats, setStats] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const carregarEstatisticas = async () => {
      try {
        // 1. Tenta buscar no seu Java
        const res = await api.get('/estatisticas');
        setStats(res.data);
      } catch (error) {
        // 2. Se o Java estiver desligado (erro), usa os dados de teste
        console.warn("⚠️ Servidor Java offline. Usando dados de demonstração.");
        setStats({
          totalTimes: 5,
          totalJogadores: 12,
          totalDuelistas: 7,
          totalSuportes: 5
        });
      }
    };

    carregarEstatisticas();
  }, []); // Mantém o array vazio para rodar só uma vez ao carregar a página

  // Estado de carregamento elegante
  if (!stats) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-cyan-500 font-black text-2xl animate-pulse italic tracking-tighter">
          LOADING_SYSTEM...
        </div>
      </div>
    )
  }

  // Preparando dados para o gráfico de barras
  const dadosGrafico = [
    { name: 'DUELISTAS', total: stats.totalDuelistas, color: '#ef4444' }, // Vermelho
    { name: 'SUPORTES', total: stats.totalSuportes, color: '#22c55e' },  // Verde
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500/30">
      <Navbar />

      <main className="p-8 max-w-7xl mx-auto">
        {/* HEADER DA HOME */}
        <header className="mb-12">
          <h2 className="text-4xl font-black tracking-tight uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">
            Painel de Controle
          </h2>
          <p className="text-slate-400 mt-2 font-medium">Bem-vindo de volta, Comandante. Aqui está o resumo da sua organização.</p>
        </header>

        {/* GRID DE CARDS DE ESTATÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

          {/* Card Total Times */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl hover:border-cyan-500/40 transition-all group cursor-default">
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Organizações</p>
            <h3 className="text-5xl font-black mt-3 group-hover:scale-110 transition-transform origin-left">{stats.totalTimes}</h3>
            <div className="mt-4 h-1 w-12 bg-cyan-500 rounded-full group-hover:w-full transition-all duration-500"></div>
          </div>

          {/* Card Total Jogadores */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl hover:border-purple-500/40 transition-all group cursor-default">
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Atletas Totais</p>
            <h3 className="text-5xl font-black mt-3 group-hover:scale-110 transition-transform origin-left">{stats.totalJogadores}</h3>
            <div className="mt-4 h-1 w-12 bg-purple-500 rounded-full group-hover:w-full transition-all duration-500"></div>
          </div>

          {/* Card Duelistas */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl hover:border-red-500/40 transition-all group cursor-default text-red-500">
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Duelistas</p>
            <h3 className="text-5xl font-black mt-3 group-hover:scale-110 transition-transform origin-left">{stats.totalDuelistas}</h3>
            <p className="text-[10px] text-slate-600 mt-2 font-mono uppercase">Potencial de Abate</p>
          </div>

          {/* Card Suportes */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl hover:border-green-500/40 transition-all group cursor-default text-green-500">
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Suportes</p>
            <h3 className="text-5xl font-black mt-3 group-hover:scale-110 transition-transform origin-left">{stats.totalSuportes}</h3>
            <p className="text-[10px] text-slate-600 mt-2 font-mono uppercase">Estratégia & Utilitária</p>
          </div>
        </div>

        {/* SEÇÃO DO GRÁFICO E AÇÕES RÁPIDAS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* GRÁFICO DE DISTRIBUIÇÃO */}
          <section className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
            <h3 className="text-xl font-bold mb-8 italic text-cyan-500 uppercase tracking-tighter">
              Distribuição de Funções
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosGrafico}>
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #1e293b',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  />
                  <Bar dataKey="total" radius={[8, 8, 0, 0]} barSize={50}>
                    {dadosGrafico.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* ATALHOS RÁPIDOS */}
          <section className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl flex flex-col justify-center">
            <h3 className="text-lg font-bold mb-6 text-slate-400 uppercase tracking-widest text-center">Gerenciamento</h3>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 px-6 py-4 rounded-2xl font-bold flex items-center justify-between transition-all group cursor-pointer"
              >
                <span>Times</span>
                <span className="text-cyan-500 group-hover:translate-x-1 transition-transform">➔</span>
              </button>
              <button
                onClick={() => navigate('/jogadores')}
                className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 px-6 py-4 rounded-2xl font-bold flex items-center justify-between transition-all group cursor-pointer"
              >
                <span>Jogadores</span>
                <span className="text-purple-500 group-hover:translate-x-1 transition-transform">➔</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-600 mt-8 text-center font-mono uppercase tracking-tighter">
              Acesso rápido aos módulos do sistema v1.0
            </p>
          </section>

        </div>
      </main>
    </div>
  )
}