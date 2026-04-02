import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Jogadores from './pages/Jogadores'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/* Quando o caminho for "/", mostra o Login */}
        <Route path="/" element={<Login />} />

        {/* 2. O LUGAR CERTO DA ROTA HOME É AQUI DENTRO! */}
        <Route path="/home" element={<Home />} />

        {/* Quando o caminho for "/dashboard", mostra o Painel de Times */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Quando o caminho for "/jogadores", mostra a Gestão de Atletas */}
        <Route path="/jogadores" element={<Jogadores />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App