# 🏆 Esports Manager - Full Stack System

O **Esports Manager** é uma plataforma completa de gestão para organizações de esportes eletrônicos. O sistema permite o controle total de times e atletas, oferecendo uma visão analítica através de dashboards dinâmicos, segurança via JWT e uma interface de alta performance.

---

## 🚀 Tecnologias Utilizadas

### **Back-end**
* **Java 21** & **Spring Boot 3**
* **Spring Security** com Autenticação **JWT** (JSON Web Token)
* **Spring Data JPA** para persistência de dados
* **H2 Database** (Desenvolvimento) / **PostgreSQL** (Produção)
* **Bean Validation** para regras de negócio e integridade

### **Front-end**
* **React** (Vite) com **TypeScript**
* **Tailwind CSS v4** (Design moderno e otimizado)
* **Recharts** (Gráficos analíticos em tempo real)
* **Axios** (Integração com API)
* **React Hot Toast** & **Custom Modals** (Experiência de Usuário Premium)

---

## ⚡ Principais Funcionalidades

* **Dashboard Inteligente:** Resumo visual da organização com gráficos de distribuição de funções (Duelistas vs Suportes).
* **Gestão de Atletas (CRUD):** Cadastro completo com filtros de busca em tempo real e ordenação dinâmica por Nickname ou Time.
* **Gestão de Organizações:** Controle de times com validações de integridade (ex: regras para exclusão).
* **Autenticação Segura:** Fluxo de login com armazenamento de token e proteção de rotas.
* **UX de Elite:** Notificações flutuantes, modais de confirmação customizados e design responsivo.

---

## 🛠️ Como Executar o Projeto

### 1. Pré-requisitos
* Java JDK 21+
* Node.js 18+
* Maven

### 2. Configurando o Back-end
1. Navegue até a pasta do servidor: `cd backend`
2. Execute o projeto: `./mvnw spring-boot:run`
3. A API estará disponível em: `http://localhost:8080`

### 3. Configurando o Front-end
1. Navegue até a pasta web: `cd frontend`
2. Instale as dependências: `npm install`
3. Crie um arquivo `.env` com: `VITE_API_URL=http://localhost:8080`
4. Inicie o servidor de desenvolvimento: `npm run dev`

---

## 📈 Estrutura de Clean Architecture

O projeto segue os princípios de **Clean Code** e **SOLID**, garantindo que o código seja escalável e de fácil manutenção. No front-end, utilizamos a componentização para evitar repetição de código (DRY), como a `Navbar` e o `ConfirmModal` unificados.

---

## 👤 Autor

* **Izack** - *Desenvolvedor Full-Stack* - [Seu GitHub Aqui]
* Estudante de Análise e Desenvolvimento de Sistemas na **PUCPR** (2026).

---

> "Construindo o futuro dos e-sports, um commit de cada vez." 🎮