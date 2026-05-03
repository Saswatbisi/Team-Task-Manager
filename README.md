# 🧩 Team Task Manager (Full-Stack)

A simple yet powerful **team collaboration web application** that helps users manage projects, assign tasks, and track progress efficiently using role-based access control.

This project is built as part of a real-world full-stack learning experience to simulate how teams work in production environments.

---


# 📌 Project Overview

Managing tasks across a team can quickly become messy when done manually.
This application solves that problem by providing a **centralized system** where:

* Teams can manage projects
* Tasks can be assigned and tracked
* Progress is visible in a structured dashboard

---

# ✨ Key Features

## 🔐 Authentication

* User Signup & Login
* Secure password hashing (bcrypt)
* JWT-based authentication

---

## 👥 Role-Based Access Control

### Admin

* Create and manage projects
* Add/remove team members
* Assign tasks

### Member

* View assigned tasks
* Update task status

---

## 📁 Project Management

* Create new projects
* Add team members
* View project details

---

## ✅ Task Management

* Create tasks
* Assign tasks to users
* Update task status:

  * Pending
  * In Progress
  * Completed
* Set deadlines

---

## 📊 Dashboard

* Total tasks overview
* Completed vs Pending tasks
* Overdue tasks tracking

---

# ⚙️ Tech Stack

## Frontend

* React.js

## Backend

* Node.js
* Express.js

## Database

* MongoDB 

## Authentication

* JWT (JSON Web Tokens)

## Deployment

* Backend: Railway
* Frontend: Vercel / Netlify

---

# 🔄 How the Application Works

1. User signs up or logs in
2. Backend verifies credentials and returns a JWT token
3. Token is used to access protected routes
4. Admin creates projects and assigns tasks
5. Members update task progress
6. Dashboard updates automatically

👉 Flow:
User → Frontend → API → Backend → Database → Response → UI

---

# 🧠 Database Structure

### User

* name
* email
* password
* role (Admin / Member)

### Project

* title
* description
* createdBy
* members

### Task

* title
* description
* assignedTo
* projectId
* status
* deadline

---

# 🔌 API Endpoints

## Auth

* POST `/signup`
* POST `/login`

## Projects

* POST `/projects`
* GET `/projects`
* GET `/projects/:id`

## Tasks

* POST `/tasks`
* GET `/tasks`
* PUT `/tasks/:id`
* DELETE `/tasks/:id`

---

# 🛡️ Security

* Passwords are hashed
* JWT-based authentication
* Protected routes using middleware
* Role-based authorization

---

# 🧪 Validations

* Required fields validation
* Email format checking
* Password strength validation
* Deadline validation

---

# 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Saswatbisi/Team-Task-Manager.git

# Navigate to project
cd Team-Task-Manager

# Install dependencies
npm install
```

---

# ▶️ Run Locally

```bash
npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_database_url
JWT_SECRET=your_secret_key
```

---

# 📈 Future Improvements

* Notifications (email / in-app)
* Task filtering & search
* File uploads in tasks
* Team chat feature

---

# 🙌 Conclusion

This project demonstrates:

* Full-stack development
* REST API design
* Authentication & authorization
* Real-world task management workflow



⭐ Feel free to explore, use, or improve this project!
