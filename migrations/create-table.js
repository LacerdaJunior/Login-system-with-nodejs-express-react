import sql from "../src/config/db.js";

async function createTable() {
  try {
    await sql`
        CREATE TABLE users (

                id          TEXT PRIMARY KEY,
                name        VARCHAR(100) NOT NULL,
                email       VARCHAR(150) UNIQUE NOT NULL,
                password    TEXT NOT NULL
                
                ); `;

    console.log("Table created successfully ");
  } catch (error) {
    console.error("Error creating table", error);
  }
}

createTable();
