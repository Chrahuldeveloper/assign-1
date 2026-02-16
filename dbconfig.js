import { Pool } from "pg"

const pool = new Pool({
    user: 'rahul',
    host: 'localhost',
    database: 'assign_1',
    password: 'rahul123',
    port: 5432,
})


async function createUsersTable() {
    try {
        const q = `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        CREATE TABLE IF NOT EXISTS Users ( 
        user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('USER', 'ADMIN')) DEFAULT 'USER',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
  )`
        await pool.query(q);
        console.log("users Table Created");
    } catch (err) {
        console.error("Error executing query", err.stack);
    } finally {
        await pool.end();
    }
}

async function createTaskTable() {
    try {
        const q = `
        CREATE TABLE IF NOT EXISTS Tasks(
          Task_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          CONSTRAINT fk_task_user FOREIGN KEY(user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
          status TEXT NOT NULL CHECK (status IN ('Complete', 'InComplete')) DEFAULT 'InComplete',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        )
        `;
        await pool.query(q)
        console.log("Tasks Table Created");
    } catch (error) {
        console.log(error)
    } 

}

export { createUsersTable, createTaskTable , pool}
