# 🚀 Smart Workflow Performance Tool

A full-stack, role-based task management and employee performance tracking system designed to streamline workflows, improve productivity, and provide real-time insights into team performance.

---

## 📌 Overview

The **Smart Workflow Performance Tool** is an enterprise-style application that enables organizations to manage users, assign tasks, monitor progress, and evaluate employee performance — all in a structured and transparent workflow system.

It supports multiple roles (**Admin, Manager, Employee**) with secure access control and dynamic dashboards tailored to each role.

---

## ✨ Key Features

### 🔐 Role-Based Access Control (RBAC)

- **Admin**
  - Manage users (create, activate/deactivate)
  - Reassign employees when a manager is deactivated
  - View organization-wide performance

- **Manager**
  - Assign tasks to employees
  - Review submissions and provide feedback
  - Approve / Reject tasks

- **Employee**
  - View assigned tasks
  - Update task status
  - Submit work with links (GitHub/Drive/etc.)
  - Resubmit rejected tasks

---

### 📋 Task Management System

- Task lifecycle:
  ```
  PENDING → IN_PROGRESS → SUBMITTED → APPROVED / REJECTED
  ```
- Priority levels: High / Medium / Low
- Deadline tracking
- Submission link support

---

### 📊 Performance Monitoring

- Admin can:
  - View performance of employees under each manager
  - Analyze productivity using bar charts

- Manager can:
  - Track team performance
  - View completion rate
  - Visualize task distribution using pie charts

---

### 🔄 Advanced Workflow Features

- Task resubmission after rejection
- Manager feedback system
- Automatic employee reassignment before manager deactivation
- Real-time UI updates after actions

---

### 🔐 Secure Authentication & Authorization

- JWT-based authentication
- Protected APIs using Spring Security
- Role-based route rendering in frontend

---

## 🛠️ Tech Stack

### 💻 Frontend
- React (Vite)
- Bootstrap 5
- Chart.js
- React Router

### ⚙️ Backend
- Spring Boot
- Spring Security
- REST APIs

### 🗄️ Database
- MySQL

### 🔐 Authentication
- JSON Web Token (JWT)

---

## 🏗️ System Architecture

- Follows RESTful architecture
- Frontend (React) communicates with Backend (Spring Boot APIs)
- Backend handles:
  - Authentication & Authorization
  - Business logic
  - Database operations
---
## 🎯 Use Cases

- Improve workflow transparency
- Track employee productivity
- Standardize task management
- Reduce manual tracking effort

