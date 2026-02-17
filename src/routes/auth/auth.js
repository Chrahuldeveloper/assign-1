import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../../../dbconfig.js";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { name, email, password } = req.body;

    const existingUser = await client.query(
      "SELECT user_id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await client.query(
      `
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, 'USER')
      RETURNING user_id, email, role
      `,
      [name, email, passwordHash]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0]
    });
  } catch (err) {
    next(err);
  } finally {
    client.release();
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `
      SELECT user_id, email, password_hash, role
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.user_id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
