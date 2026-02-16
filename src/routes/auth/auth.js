import express from 'express'
const app = express()
import bcrypt from "bcrypt";
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

        const passwordHash = await bcrypt.hash(password, 12);

        await client.query("INSERT INTO Users (name, email, password , role) VALUES ($1, $2, $3,$4)", [name, email, passwordHash, role])

        res.status(201).json({
            message: "User registered successfully",
            user: result.rows[0]
        });


    } catch (error) {
        console.log(error)
    }

})


app.get("/api/v1/auth/login", async (req, res) => {
    try {

        const { email, password } = req.body

        const result = await pool.query("SELECT user_id FROM Users WHERE email=$!", [email])

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }


        const user = result.rows[0];

        const isValid = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });


    } catch (error) {
        console.log(error)
    }
})