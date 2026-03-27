# 🚀 TaskSystem - Gerenciamento Colaborativo de Tarefas

O **TaskSystem** é uma plataforma SaaS Full Stack projetada para organizar fluxos de trabalho colaborativos. Mais do que um simples To-Do List, o sistema oferece um ambiente onde usuários podem construir redes de amigos, delegar tarefas com controle de permissões e acompanhar a produtividade através de métricas automatizadas em tempo real.

🔗 **Acesse o projeto online:** [tasksystem-web.vercel.app](https://tasksystem-web.vercel.app)

---

## 📸 Screenshots

<div align="center">
  <img src="https://github.com/LacerdaJunior/tasksystem-fullstack/blob/main/frontend/src/assets/readme/1.png" alt="Home Page" width="400">
  <img src="https://github.com/LacerdaJunior/tasksystem-fullstack/blob/main/frontend/src/assets/readme/2.png" alt="Kanban Board" width="400">
  <br>
  <img src="https://github.com/LacerdaJunior/tasksystem-fullstack/blob/main/frontend/src/assets/readme/3.png" alt="Dashboard Métricas" width="400">
  <img src="https://github.com/LacerdaJunior/tasksystem-fullstack/blob/main/frontend/src/assets/readme/4ok.png" alt="Edit Modal" width="400">
</div>

---

## ✨ Funcionalidades de Alto Nível

### 🛡️ Controle de Acesso e Permissões (RBAC)
O sistema implementa uma regra de negócio rigorosa: apenas o **Dono** da tarefa pode editar título, descrição e reatribuir o responsável. O **Convidado** possui visão privilegiada de execução, podendo interagir apenas com o checklist de progresso.

### 👤 Gestão de Identidade
- Fluxo de autenticação completo com **JWT** e criptografia **Bcrypt**.
- Identidade única através de sistema de **@username** exclusivo.
- Personalização de perfis com avatares dinâmicos.

### 🤝 Networking e Colaboração
- Sistema de amizades com envio e aceite de convites.
- Delegação dinâmica de tarefas para membros da sua rede.

### 📊 Dashboard e UX
- Quadro Kanban interativo para gestão de status.
- Gráficos de produtividade baseados no status global das tarefas e progresso dos checklists.
- Interface 100% responsiva otimizada para Desktop e Mobile.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologias |
| :--- | :--- |
| **Frontend** | React.js, Vite, Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express, PostgreSQL |
| **Infra** | Neon DB (Database), Vercel (Frontend), Render (API) |
| **Segurança** | JSON Web Tokens (JWT), Bcrypt, Middlewares de Autenticação |

---

## 🚀 Como executar o projeto localmente

### Pré-requisitos
- Node.js instalado
- Uma instância de PostgreSQL (ou conta no [Neon.tech](https://neon.tech))

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/LacerdaJunior/Login-system-with-nodejs-express-react.git](https://github.com/LacerdaJunior/Login-system-with-nodejs-express-react.git)
Configure o Backend:

Bash
cd backend
npm install
# Crie um arquivo .env com DATABASE_URL, PORT e JWT_SECRET
npm run dev
Configure o Frontend:

Bash
cd ../frontend
npm install
# Crie um arquivo .env.local com VITE_API_URL=http://localhost:3333
npm run dev
🗺️ Roadmap de Evolução (V2.0)
[ ] WebSockets: Implementação de Socket.io para atualizações em tempo real.

[ ] Docker: Containerização completa do ambiente de desenvolvimento.

[ ] Testes: Cobertura de testes unitários com Jest e testes E2E com Cypress.

Desenvolvido com foco em Engenharia de Software por Guilherme Lacerda.
