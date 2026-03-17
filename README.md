````markdown
# 🚀 [TaskHub]

Uma plataforma web colaborativa para gerenciamento de tarefas e eventos entre amigos, com sistema de perfis customizáveis.

## 💡 Sobre o Projeto

Iniciado como um sistema robusto de autenticação, este projeto está evoluindo para um SaaS (Software as a Service) colaborativo. O objetivo é permitir que usuários criem contas de forma segura, personalizem seus avatares e gerenciem projetos em equipe com comunicação em tempo real.

## 🛠️ Tecnologias Utilizadas

**Frontend:**

- React (com Vite)
- Tailwind CSS (Estilização)
- Framer Motion (Animações de interface)
- React Router DOM (Navegação)
- Lucide React (Ícones)

**Backend:**

- Node.js com Express
- PostgreSQL hospedado no Neon DB (Banco de dados relacional na nuvem)
- Bcrypt (Criptografia de senhas)

## ⚙️ Funcionalidades Atuais

- [x] Criação de conta e Autenticação de usuários.
- [x] Criptografia de senhas com padrão de mercado (Bcrypt).
- [x] Painel de perfil com seleção e atualização de avatar.
- [x] Proteção de rotas no Frontend (Route Guards).
- [x] Separação de responsabilidades no Backend (Controllers/Services).

## 🗺️ Roadmap (Próximos Passos)

- [ ] **Sistema de Amizades:** Tabelas relacionais (Many-to-Many) para envio e aceite de convites.
- [ ] **Tasks Compartilhadas:** Criação de eventos e tarefas atribuídas a múltiplos usuários.
- [ ] **Chat em Tempo Real:** Integração com WebSockets (`Socket.io`) para comunicação instantânea.
- [ ] **Deploy e Infraestrutura:** Containerização da aplicação com **Docker** e hospedagem na **AWS** para garantir alta disponibilidade.

## 🚀 Como executar o projeto localmente

> **Nota:** Estas instruções são destinadas a desenvolvedores ou recrutadores que desejam clonar e testar a aplicação em ambiente de desenvolvimento local.

### Pré-requisitos

- Node.js instalado
- Git instalado
- Uma conta no [Neon](https://neon.tech/) (para o banco de dados PostgreSQL)

### Passo a Passo

1. Clone este repositório:

```bash
git clone https://github.com/LacerdaJunior/Login-system-with-nodejs-express-react.git
```
````

2. Instale as dependências (execute o comando abaixo em ambas as pastas, frontend e backend):

```bash
npm install

```

3. Configuração do Banco de Dados e Variáveis de Ambiente:

- Crie um arquivo `.env` na raiz da pasta do backend.
- Adicione a sua string de conexão do PostgreSQL e a porta do servidor:

```env
DATABASE_URL="sua_string_de_conexao_do_neon_aqui"
PORT=3333

```

4. Inicie os servidores:

```bash
# Na pasta do backend
npm run dev

# Na pasta do frontend
npm run dev

```

---

_Desenvolvido com foco em boas práticas de Engenharia de Software e Arquitetura Web._
