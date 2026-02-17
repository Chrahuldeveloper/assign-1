import { useCallback, useEffect, useState } from "react";
import { request } from "../api/api";

export default function Dashboard({ onLogout }) {
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const loadTasks = useCallback(async () => {
    try {
      const res = await request("/tasks", "GET", null, token);
      setTasks(res.tasks);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    }
  }, [token]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const createTask = async () => {
    try {
      if (!title.trim()) return;
      await request("/tasks", "POST", { title }, token);
      setTitle("");
      loadTasks();
    } catch (err) {
      setError(err.message || "Failed to create task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await request(`/tasks/${id}`, "DELETE", null, token);
      loadTasks();
    } catch (err) {
      setError(err.message || "Failed to delete task");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <button
            onClick={onLogout}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="New task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            onClick={createTask}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Add
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">
            No tasks yet. Add one 👆
          </p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((t) => (
              <li
                key={t.task_id}
                className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg"
              >
                <span className="text-gray-800">{t.title}</span>
                <button
                onClick={() => deleteTask(t.task_id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
