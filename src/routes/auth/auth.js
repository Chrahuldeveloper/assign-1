import express from 'express'
const app = express()
import { pool } from '../../../dbconfig'

app.get("/api/v1/auth/register", async (req, res) => {

    try {
        const client = await pool.connect();

        const { name, email, password, role } = req.body;


        const userExists = await client.query("SELECT user_id FROM Users WHERE email=$1", [email])

        if (userExists.rows.length > 0) {

            return res.status(409).json({
                message: "Email already registered"
            });

        }

        const res = await client.query("INSERT INTO Users (name, email, password , role) VALUES ($1, $2, $3,$4)",[name, email, password, role])

        res.status(201).json({
            message: "User registered successfully",
            user: result.rows[0]
        });


    } catch (error) {
        console.log(error)
    }

})


app.get("/api/v1/auth/login")