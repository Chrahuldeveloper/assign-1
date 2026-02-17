import express from "express";
import dotenv from "dotenv";
import { createTaskTable, createUsersTable } from "./dbconfig.js";

import authRouter from "./src/routes/auth/auth.js";
import taskRouter from "./src/routes/tasks/task.js";
import  authenticate from "./src/middleware/auth.middleware.js";
import cors from "cors";

const app = express();
const PORT = 3005;

dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tasks", authenticate, taskRouter);

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
});


app.get("/", (req, res) => {
    res.json({ status: "API running" });
});

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    try {
        await createUsersTable();
        await createTaskTable();
    } catch (err) {
        console.error(" server connection failed", err);
    }
});
