import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Navbar from '../components/Navbar'
import { toast } from 'react-hot-toast'
import ConfirmModal from '../components/ConfirmModal'

export default function Dashboard() {
  const [times, setTimes] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editandoId, setEditandoId] = useState(null)

  const [novoTimeNome, setNovoTimeNome] = useState('')
  const [novaTag, setNovaTag] = useState('')
  const [novoJogo, setNovoJogo] = useState('')
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState(null);

  const navigate = useNavigate()

  const buscarDados = async () => {
    try {
      const resposta = await api.get('/times')
      setTimes(resposta.data)
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
    }
  }

  useEffect(() => { buscarDados() }, [])

  const handleSalvarTime = async (e) => {
    e.preventDefault()
    const dadosTime = {
      nome: novoTimeNome,
      tag: novaTag.toUpperCase(),
      jogo: novoJogo
    }

    try {
      if (editandoId) {
        await api.put(`/times/${editandoId}`, dadosTime)
        toast.success('Time atualizado com sucesso! 🏆')
      } else {
        await api.post('/times', dadosTime)
        toast.success('Time cadastrado com sucesso! 🚀')
      }
      fecharModal()
      buscarDados()
    } catch (error) {
      toast.error('Erro ao salvar o time. Verifique os dados.')
    }
  }

  const abrirConfirmacaoExclusao = (id) => {
    setIdParaExcluir(id);
    setIsConfirmOpen(true);
  }

  const executarExclusao = async () => {
    try {
      await api.delete(`/times/${idParaExcluir}`);
      toast.success("Time removido com sucesso! 🛡️");
      buscarDados();
    } catch (error) {
      toast.error("Erro ao remover: Verifique se existem jogadores vinculados.");
    } finally {
      setIsConfirmOpen(false);
      setIdParaExcluir(null);
    }
  }

  const abrirModalEdicao = (time) => {
    setEditandoId(time.id)
    setNovoTimeNome(time.nome)
    setNovaTag(time.tag)
    setNovoJogo(time.jogo)
    setIsModalOpen(true)
  }

  const fecharModal = () => {
    setEditandoId(null)
    setNovoTimeNome('')
    setNovaTag('')
    setNovoJogo('')
    setIsModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <Navbar />

      <main className="p-8 max-w-7xl mx-auto">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Times Cadastrados</h2>
            <p className="text-slate-400">Gerencie as equipes da sua organização.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-cyan-900/20 transition-all active:scale-95 cursor-pointer"
          >
            + Novo Time
          </button>
        </header>

        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs tracking-widest font-bold">
              <tr>
                <th className="px-6 py-5">Time / Tag</th>
                <th className="px-6 py-5">Jogo</th>
                <th className="px-6 py-5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {times.map((time) => (
                <tr key={time.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-5">
                    <div className="font-bold text-cyan-400 text-lg uppercase">{time.nome}</div>
                    <div className="text-sm text-slate-500 font-mono">TAG: {time.tag}</div>
                  </td>
                  <td className="px-6 py-5 text-slate-300 font-medium">{time.jogo}</td>
                  {/* OS BOTÕES NO LUGAR CERTO (DENTRO DA TABELA) */}
                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => abrirModalEdicao(time)}
                        className="text-cyan-500 hover:text-cyan-300 font-bold cursor-pointer text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => abrirConfirmacaoExclusao(time.id)}
                        className="text-slate-500 hover:text-red-500 font-bold cursor-pointer text-sm"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 italic text-cyan-500">
              {editandoId ? 'EDITAR TIME' : 'NOVO TIME'}
            </h3>
            <form onSubmit={handleSalvarTime} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nome</label>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  value={novoTimeNome}
                  onChange={(e) => setNovoTimeNome(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tag</label>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  value={novaTag}
                  onChange={(e) => setNovaTag(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Jogo</label>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  value={novoJogo}
                  onChange={(e) => setNovoJogo(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={fecharModal} className="flex-1 bg-slate-800 py-3 rounded-xl font-bold">Cancelar</button>
                <button type="submit" className="flex-1 bg-cyan-600 py-3 rounded-xl font-bold shadow-lg shadow-cyan-900/20">
                  {editandoId ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    <ConfirmModal
      isOpen={isConfirmOpen}
      onClose={() => setIsConfirmOpen(false)}
      onConfirm={executarExclusao}
      title="Remover Organização?"
      message="Isso excluirá o time permanentemente. Certifique-se de que não há atletas vinculados antes de prosseguir."
    />
    </div>
  )
}