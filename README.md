# Desafio de Pós-Graduação – Financy

O **Financy** é uma aplicação full-stack para gerenciamento de finanças pessoais, desenvolvida com foco em uma arquitetura moderna e escalável utilizando GraphQL e React.


## 💻 Tecnologias

Este repositório contém:

- **Backend**
  - Linguagem: TypeScript
  - API: GraphQL (Type-GraphQL + Apollo Server)
  - ORM: Prisma
  - Banco de dados: SQLite
  - Autenticação: JWT

- **Frontend**
  - Linguagem: TypeScript
  - Framework: React
  - Client GraphQL: Apollo Client
  - Estilização: Tailwind CSS + Shadcn/ui

## ⚙️ Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:

- Node.js (v18 ou superior)
- pnpm


## 🛠️ Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd desafio
   ```

2. **Configure as variáveis de ambiente**
   Copie os arquivos `.env.example` e renomeie para `.env` no frontend e backend.

   **Backend (`backend/.env`):**
   ```env
   JWT_SECRET=seu_secret_key_aqui
   DATABASE_URL="file:./dev.db"
   ```

   **Frontend (`frontend/.env`):**
   ```env
   VITE_BACKEND_URL=http://localhost:4000/graphql
   ```

3. **Instale as dependências do Backend**
   ```bash
   cd backend
   pnpm install
   ```

4. **Execute as migrations do banco de dados**
   ```bash
   pnpm migrate
   ```

5. **Instale as dependências do Frontend**
   ```bash
   cd ../frontend
   pnpm install
   ```

6. **Execute o projeto**
   Você precisará de dois terminais:

   **Terminal 1 (Backend):**
   ```bash
   cd backend
   pnpm dev
   ```

   **Terminal 2 (Frontend):**
   ```bash
   cd frontend
   pnpm dev
   ```

   O backend estará disponível em: `http://localhost:4000/graphql`
   O frontend estará disponível em: `http://localhost:5173`
