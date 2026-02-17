import express from "express";
import { createTaskTable, createUsersTable } from "./dbconfig.js";

import authRouter from "./src/routes/auth/auth.js";
import taskRouter from "./src/routes/tasks/task.js";
import { authenticate } from "./src/middleware/auth.middleware.js";
const app = express();
const PORT = 3005;

app.use(express.json());

app.use("/auth", authRouter);
app.use("/tasks", authenticate, taskRouter);

app.get("/", (req, res) => {
    res.json({ status: "API running" });
});

app.listen(PORT, async () => {
    console.log(` Server running on port ${PORT}`);
    try {
        await createUsersTable();
        await createTaskTable();
    } catch (err) {
        console.error(" server connection failed", err);
    }
});
