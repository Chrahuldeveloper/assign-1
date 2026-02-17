import express from "express";
import { pool } from "../../../dbconfig.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const { userId } = req.user;

    const result = await pool.query(
      `
      INSERT INTO tasks (title, description, user_id)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [title, description, userId]
    );

    res.status(201).json({
      message: "Task created",
      task: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
});


router.get("/", async (req, res, next) => {
  try {
    const { userId, role } = req.user;

    const query =
      role === "ADMIN"
        ? "SELECT * FROM tasks ORDER BY created_at DESC"
        : "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC";

    const values = role === "ADMIN" ? [] : [userId];

    const result = await pool.query(query, values);

    res.json({ tasks: result.rows });
  } catch (err) {
    next(err);
  }
});


router.get("/:id", async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const { userId, role } = req.user;

    const result = await pool.query(
      "SELECT * FROM tasks WHERE id = $1",
      [taskId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Task not found" });
    }

    const task = result.rows[0];

    if (role !== "ADMIN" && task.user_id !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ task });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const { title, description } = req.body;
    const { userId, role } = req.user;

    const taskResult = await pool.query(
      "SELECT * FROM tasks WHERE id = $1",
      [taskId]
    );

    if (!taskResult.rows.length) {
      return res.status(404).json({ message: "Task not found" });
    }

    const task = taskResult.rows[0];

    if (role !== "ADMIN" && task.user_id !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const result = await pool.query(
      `
      UPDATE tasks
      SET title = $1,
          description = $2,
          updated_at = NOW()
      WHERE id = $3
      RETURNING *
      `,
      [title, description, taskId]
    );

    res.json({
      message: "Task updated",
      task: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const { userId, role } = req.user;

    const taskResult = await pool.query(
      "SELECT * FROM tasks WHERE id = $1",
      [taskId]
    );

    if (!taskResult.rows.length) {
      return res.status(404).json({ message: "Task not found" });
    }

    const task = taskResult.rows[0];

    if (role !== "ADMIN" && task.user_id !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    await pool.query(
      "DELETE FROM tasks WHERE id = $1",
      [taskId]
    );

    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
