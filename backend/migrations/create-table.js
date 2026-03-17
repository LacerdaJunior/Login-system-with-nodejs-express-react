import sql from "../src/config/db.js";

async function createTable() {
  try {
    await sql`
    CREATE TABLE tasks (
      id UUID PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      is_completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      user_email VARCHAR(150) NOT NULL,
  
    CONSTRAINT fk_user
      FOREIGN KEY(user_email) 
      REFERENCES users(email)
      ON DELETE CASCADE
);
        
`;
    console.log("Table created successfully ");
  } catch (error) {
    console.error("Error creating table", error);
  }
}
createTable();

//Para fins de testes de dev, segue abaixo as tabelas a serem adicionadas:

/* 1 tabela a se adicionar:

CREATE TABLE users (

  id          TEXT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) UNIQUE NOT NULL,
  password    TEXT NOT NULL
  
  ); 
  
  */

/* 2 tabela a se adicionar:

  CREATE TABLE tasks (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_email VARCHAR(150) NOT NULL,

  CONSTRAINT fk_user
    FOREIGN KEY(user_email) 
    REFERENCES users(email)
    ON DELETE CASCADE
);

*/
