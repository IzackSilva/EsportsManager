import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import ConfirmModal from '../components/ConfirmModal'

export default function Jogadores() {
  const [jogadores, setJogadores] = useState([])
  const [times, setTimes] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editandoId, setEditandoId] = useState(null)

  // ESTADOS DE BUSCA E ORDENAÇÃO
  const [busca, setBusca] = useState('')
  const [campoOrdenacao, setCampoOrdenacao] = useState('nickname')
  const [direcaoOrdenacao, setDirecaoOrdenacao] = useState('asc')

  // ESTADOS DO MODAL DE CONFIRMAÇÃO
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [idParaExcluir, setIdParaExcluir] = useState(null)

  // ESTADOS DO FORMULÁRIO
  const [nickname, setNickname] = useState('')
  const [funcao, setFuncao] = useState('')
  const [timeId, setTimeId] = useState('')

  const navigate = useNavigate()

  const carregarDados = async () => {
    try {
      const [resJogadores, resTimes] = await Promise.all([
        api.get('/jogadores'),
        api.get('/times')
      ]);
      setJogadores(resJogadores.data);
      setTimes(resTimes.data);
    } catch (error) {
      console.warn("⚠️ Servidor Offline. Carregando atletas de demonstração.");
      // Dados para o seletor do formulário
      setTimes([
        { id: 1, nome: "LOUD" },
        { id: 2, nome: "Sentinels" }
      ]);
      // Dados para a tabela
      setJogadores([
        { id: 10, nickname: "Aspas", funcao: "Duelista", nomeTime: "LOUD" },
        { id: 11, nickname: "Less", funcao: "Suporte", nomeTime: "LOUD" },
        { id: 12, nickname: "TenZ", funcao: "Duelista", nomeTime: "Sentinels" },
        { id: 13, nickname: "Sacy", funcao: "Suporte", nomeTime: "Sentinels" }
      ]);
    }
  };
  useEffect(() => { carregarDados() }, [])

  // LÓGICA DE FILTRO E ORDENAÇÃO
  const jogadoresFiltrados = jogadores.filter(j =>
    j.nickname.toLowerCase().includes(busca.toLowerCase()) ||
    j.nomeTime.toLowerCase().includes(busca.toLowerCase()) ||
    j.funcao.toLowerCase().includes(busca.toLowerCase())
  )

  const jogadoresOrdenados = [...jogadoresFiltrados].sort((a, b) => {
    const valorA = a[campoOrdenacao]?.toString().toLowerCase() || ''
    const valorB = b[campoOrdenacao]?.toString().toLowerCase() || ''
    if (valorA < valorB) return direcaoOrdenacao === 'asc' ? -1 : 1
    if (valorA > valorB) return direcaoOrdenacao === 'asc' ? 1 : -1
    return 0
  })

  const handleOrdenar = (campo) => {
    const novaDirecao = campo === campoOrdenacao && direcaoOrdenacao === 'asc' ? 'desc' : 'asc'
    setCampoOrdenacao(campo)
    setDirecaoOrdenacao(novaDirecao)
  }

  // FUNÇÕES DE EXCLUSÃO (COM O NOVO MODAL)
  const abrirConfirmacaoExclusao = (id) => {
    setIdParaExcluir(id)
    setIsConfirmOpen(true)
  }

  const executarExclusao = async () => {
    try {
      await api.delete(`/jogadores/${idParaExcluir}`)
      toast.success("Atleta dispensado com sucesso! 🫡")
      carregarDados()
    } catch (error) {
      toast.error("Erro ao dispensar atleta.")
    } finally {
      setIsConfirmOpen(false)
      setIdParaExcluir(null)
    }
  }

  const handleSalvarJogador = async (e) => {
    e.preventDefault()
    const payload = { nickname, funcao, timeId: Number(timeId) }
    try {
      if (editandoId) {
        await api.put(`/jogadores/${editandoId}`, payload)
        toast.success('Contrato atualizado! 🏆')
      } else {
        await api.post('/jogadores', payload)
        toast.success('Jogador contratado! 🚀')
      }
      fecharModal()
      carregarDados()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao processar jogador.')
    }
  }

  const abrirModalEdicao = (j) => {
    setEditandoId(j.id)
    setNickname(j.nickname)
    setFuncao(j.funcao)
    const timeEncontrado = times.find(t => t.nome === j.nomeTime)
    setTimeId(timeEncontrado ? timeEncontrado.id : '')
    setIsModalOpen(true)
  }

  const fecharModal = () => {
    setEditandoId(null)
    setNickname('')
    setFuncao('')
    setTimeId('')
    setIsModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <Navbar />

      <main className="p-8 max-w-7xl mx-auto">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Lineups & Atletas</h2>
            <p className="text-slate-400">Gerencie os pro-players da sua organização.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-cyan-900/20 cursor-pointer">
            + Contratar Jogador
          </button>
        </header>

        {/* BARRA DE PESQUISA */}
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Pesquisar por nick, time ou função..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-12 py-4 text-white focus:ring-2 focus:ring-cyan-500/50 outline-none"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-50">🔍</span>
        </div>

        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs tracking-widest font-bold">
              <tr>
                <th className="px-6 py-5 cursor-pointer hover:text-cyan-400" onClick={() => handleOrdenar('nickname')}>
                  Nickname {campoOrdenacao === 'nickname' && (direcaoOrdenacao === 'asc' ? '▲' : '▼')}
                </th>
                <th className="px-6 py-5 cursor-pointer hover:text-cyan-400" onClick={() => handleOrdenar('funcao')}>
                  Função {campoOrdenacao === 'funcao' && (direcaoOrdenacao === 'asc' ? '▲' : '▼')}
                </th>
                <th className="px-6 py-5 cursor-pointer hover:text-cyan-400" onClick={() => handleOrdenar('nomeTime')}>
                  Time {campoOrdenacao === 'nomeTime' && (direcaoOrdenacao === 'asc' ? '▲' : '▼')}
                </th>
                <th className="px-6 py-5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {jogadoresOrdenados.length > 0 ? (
                jogadoresOrdenados.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-5 font-bold text-cyan-400 uppercase">{j.nickname}</td>
                    <td className="px-6 py-5 text-slate-300">{j.funcao}</td>
                    <td className="px-6 py-5">
                      <span className="bg-slate-800 px-3 py-1 rounded-lg text-xs font-bold text-cyan-500 border border-slate-700">
                        {j.nomeTime}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center flex justify-center gap-4">
                      <button onClick={() => abrirModalEdicao(j)} className="text-cyan-500 font-bold hover:text-cyan-300 cursor-pointer">Editar</button>
                      <button onClick={() => abrirConfirmacaoExclusao(j.id)} className="text-slate-500 font-bold hover:text-red-500 cursor-pointer">Dispensar</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-slate-500 italic">Nenhum resultado encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL DE CADASTRO/EDIÇÃO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 italic text-cyan-500">{editandoId ? 'EDITAR' : 'NOVO'} JOGADOR</h3>
            <form onSubmit={handleSalvarJogador} className="space-y-4">
              <input type="text" placeholder="Nickname" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-500" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
              <input type="text" placeholder="Função" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-500" value={funcao} onChange={(e) => setFuncao(e.target.value)} required />
              <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer" value={timeId} onChange={(e) => setTimeId(e.target.value)} required>
                <option value="">Selecione um time...</option>
                {times.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={fecharModal} className="flex-1 bg-slate-800 py-3 rounded-xl font-bold">Cancelar</button>
                <button type="submit" className="flex-1 bg-cyan-600 py-3 rounded-xl font-bold">{editandoId ? 'Atualizar' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO (O LUGAR CERTO É AQUI!) */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={executarExclusao}
        title="Dispensar Atleta?"
        message="Esta ação não pode ser desfeita. O contrato do jogador será rescindido imediatamente."
      />
    </div>
  )
}