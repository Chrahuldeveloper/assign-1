
# 📝 Task Management API

A simple **Task Management backend** built with **Node.js, Express, PostgreSQL**, featuring **JWT authentication**, **role-based access**, **CRUD APIs**, **Swagger documentation**, and a **basic frontend**.

---

## 🚀 Features

* User Authentication (Register / Login)
* JWT-based authorization
* Role-based access (`USER`, `ADMIN`)
* Task CRUD operations
* PostgreSQL database
* Swagger (OpenAPI 3.0) documentation
* Basic frontend UI connected to APIs
* Scalable backend structure


## 🛠 Tech Stack

* **Backend:** Node.js, Express
* **Database:** PostgreSQL
* **Authentication:** JSON Web Tokens (JWT)
* **Documentation:** Swagger (OpenAPI 3.0)
* **Frontend:** HTML, CSS, JavaScript (basic)

---

## 📁 Project Structure

```
assign-1/
├── src/
│   ├── routes/
│   │   ├── auth/
│   │   └── tasks/
│   ├── middleware/
├── swagger/
│   └── swagger.json
├── index.js
├── dbconfig.js
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/assign-1.git
cd assign-1
```
---

### 2️⃣ Install Dependencies

```bash
npm install
```
---

### 3️⃣ Setup PostgreSQL Database

Create database:

```sql
CREATE DATABASE assign_1;
```

Ensure PostgreSQL is running and update credentials in `dbconfig.js`:

```js
export const pool = new Pool({
  user: "rahul",
  host: "localhost",
  database: "assign_1",
  password: "rahul123",
  port: 5432
});
```

---

### 4️⃣ Environment Variables

Create a `.env` file:

```env
PORT=3005
JWT_SECRET=your_jwt_secret_key
```

---

### 5️⃣ Start Server

```bash
npm start
```

Server runs at:

```
http://localhost:3005
```

---

## 🔐 Authentication Flow

1. Register user
2. Login to receive JWT token
3. Use token in request headers:

```
Authorization: Bearer <token>
```

---

## 📌 API Endpoints

### Auth APIs

| Method | Endpoint         | Description   |
| ------ | ---------------- | ------------- |
| POST   | `/auth/register` | Register user |
| POST   | `/auth/login`    | Login user    |

---

### Task APIs

| Method | Endpoint     | Description    |
| ------ | ------------ | -------------- |
| GET    | `/tasks`     | Get all tasks  |
| POST   | `/tasks`     | Create task    |
| GET    | `/tasks/:id` | Get task by ID |
| PUT    | `/tasks/:id` | Update task    |
| DELETE | `/tasks/:id` | Delete task    |

---

## 📖 API Documentation (Swagger)

Swagger UI is available at:

```
http://localhost:3005/api-docs
```

* Includes request/response schemas
* Supports JWT authorization
* Covers Auth and Task APIs

---

## 🎨 Frontend

* Basic UI for login and task management
* Communicates with backend APIs using `fetch`
* Handles authentication via JWT stored in browser

---

## 📦 Database Schema

### Users Table

```sql
users (
  user_id UUID PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  password_hash TEXT,
  role TEXT,
  created_at TIMESTAMP
)
```

### Tasks Table

```sql
tasks (
  id SERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  user_id UUID REFERENCES users(user_id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

---

## 📈 Scalability Notes

* Can be split into **microservices** (Auth Service, Task Service)
* Add **Redis caching** for frequent reads
* Use **load balancers** (Nginx) for horizontal scaling
* Database indexing for high query performance
* Containerization using Docker for deployment

---

## 🧪 Testing

* APIs can be tested via Swagger UI
* Postman collection can be generated from Swagger JSON

---
