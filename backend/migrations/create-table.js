import sql from "../src/config/db.js";

async function createTables() {
  try {
    console.log("Iniciando a criação das tabelas...");

    // 1ª Tabela: Usuários (A base de tudo)
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id          TEXT PRIMARY KEY,
        name        VARCHAR(100) NOT NULL,
        email       VARCHAR(150) UNIQUE NOT NULL,
        password    TEXT NOT NULL
      )
    `;
    console.log("Tabela 'users' verificada/criada com sucesso.");

    // 2ª Tabela: Categorias (Depende de users)
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id          UUID PRIMARY KEY,
        name        VARCHAR(100) NOT NULL,
        color       VARCHAR(20) DEFAULT '#6366f1',
        user_id     TEXT NOT NULL,
          
        CONSTRAINT fk_category_user
          FOREIGN KEY(user_id) 
          REFERENCES users(id)
          ON DELETE CASCADE
      )
    `;
    console.log("Tabela 'categories' verificada/criada com sucesso.");

    // 3ª Tabela: Tarefas (Depende de users e categories)
    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id          UUID PRIMARY KEY,
        title       VARCHAR(255) NOT NULL,
        description TEXT,
        status      VARCHAR(20) DEFAULT 'TODO',
        due_date    TIMESTAMP,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        category_id UUID,
        user_id     TEXT NOT NULL,

        CONSTRAINT fk_user
          FOREIGN KEY(user_id) 
          REFERENCES users(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_task_category 
          FOREIGN KEY (category_id) 
          REFERENCES categories(id) 
          ON DELETE SET NULL
      )
    `;
    console.log("Tabela 'tasks' verificada/criada com sucesso.");

    console.log("🎉 Todas as tabelas prontas para uso!");
    process.exit(0);
  } catch (error) {
    console.error("Erro ao criar tabelas:", error);
    process.exit(1);
  }
}

createTables();

// ============================================================================
// DOCUMENTAÇÃO DE REFERÊNCIA SQL (Para testes no Console do Neon)
// IMPORTANTE: Execute a criação na ordem exata abaixo devido às chaves estrangeiras.
// ============================================================================

/* 1ª Tabela: Usuários
-------------------------------------------------
CREATE TABLE users (
  id          TEXT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) UNIQUE NOT NULL,
  password    TEXT NOT NULL
); 
*/

/* 2ª Tabela: Categorias (Agora usando user_id referenciando users.id)
-------------------------------------------------
CREATE TABLE categories (
  id          UUID PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  color       VARCHAR(20) DEFAULT '#6366f1',
  user_id     TEXT NOT NULL,
    
  CONSTRAINT fk_category_user
    FOREIGN KEY(user_id) 
    REFERENCES users(id)
    ON DELETE CASCADE
);
*/

/* 3ª Tabela: Tarefas (Agora usando user_id referenciando users.id)
-------------------------------------------------
CREATE TABLE tasks (
  id          UUID PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  status      VARCHAR(20) DEFAULT 'TODO',
  due_date    TIMESTAMP,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  category_id UUID,
  user_id     TEXT NOT NULL,

  CONSTRAINT fk_user
    FOREIGN KEY(user_id) 
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_task_category 
    FOREIGN KEY (category_id) 
    REFERENCES categories(id) 
    ON DELETE SET NULL
);
*/
