import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api' // Ajuste o caminho se necessário
import { toast } from 'react-hot-toast'

function Login() {
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const navigate = useNavigate()

const handleLogin = async (e) => {
  e.preventDefault();

    // 1. CRIAMOS O LOGIN DE TESTE AQUI
    if (login === 'admin' && senha === 'admin123') {
      localStorage.setItem('token', 'TOKEN_DE_TESTE_GERADO_PELO_FRONT');
      toast.success('Entrando como Convidado (Modo de Teste) 🛡️');
      navigate('/home');
      return; // Para a execução aqui e não chama a API
    }

    // 2. LOGICA NORMAL (CHAMANDO O JAVA)
    try {
      const resposta = await api.post('/login', { login, senha });
      if (resposta.data.token) {
        localStorage.setItem('token', resposta.data.token);
        toast.success('Acesso autorizado!');
        navigate('/home');
      }
    } catch (error) {
      toast.error('Erro: O servidor Java está offline ou credenciais inválidas.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Card de Login com Tailwind v4 */}
      <div className="max-w-md w-full bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-10 transform transition-all">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-cyan-500 tracking-tight">
            ESPORTS<span className="text-white">MANAGER</span>
          </h2>
          <p className="text-slate-400 mt-2">Faça login para gerenciar sua equipe</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Usuário
            </label>
            <input
              type="text"
              required
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              placeholder="Digite seu login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Senha
            </label>
            <input
              type="password"
              required
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-900/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            ENTRAR NO SISTEMA
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-xs">
            Desenvolvido por <span className="text-slate-300 font-medium">Izack</span> • PUCPR 2026
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login