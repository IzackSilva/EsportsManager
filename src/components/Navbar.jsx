import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ConfirmModal from './ConfirmModal' // Ajuste o caminho se necessário

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)

  const isActive = (path) => location.pathname === path ? "text-cyan-400 border-b-2 border-cyan-400" : "text-slate-400 hover:text-white"

  const confirmarSair = () => {
    localStorage.removeItem('token') // Limpa o acesso
    navigate('/')
  }

  return (
    <>
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-black text-cyan-500 tracking-tighter italic">ESPORTS MANAGER</h1>
          <div className="flex gap-6 font-bold text-sm">
            <button onClick={() => navigate('/home')} className={`pb-1 cursor-pointer ${isActive('/home')}`}>Início</button>
            <button onClick={() => navigate('/dashboard')} className={`pb-1 cursor-pointer ${isActive('/dashboard')}`}>Times</button>
            <button onClick={() => navigate('/jogadores')} className={`pb-1 cursor-pointer ${isActive('/jogadores')}`}>Jogadores</button>
          </div>
        </div>

        {/* Agora abre o Modal em vez de sair direto */}
        <button
          onClick={() => setIsLogoutOpen(true)}
          className="text-sm font-medium text-slate-400 hover:text-red-400 cursor-pointer"
        >
          Sair
        </button>
      </nav>

      <ConfirmModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={confirmarSair}
        title="Encerrar Sessão?"
        message="Você precisará fazer login novamente para acessar o gerenciamento da organização."
      />
    </>
  )
}