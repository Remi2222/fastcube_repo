# FastCube Project

## Overview

FastCube is a full-stack web application composed of a modern React frontend, an Express backend API, and an integrated chatbot service.

The project includes:

* **Frontend:** React + Vite + Tailwind CSS
* **Backend:** Node.js + Express + MySQL + JWT Authentication
* **Chatbot:** FastCube AI chatbot service
* **Deployment:** Docker & Docker Compose

---

## Project Structure

```bash
fastcube/
│
├── frontend/              # React + Vite frontend application
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── backend/               # Express REST API
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── services/
│   └── server.js
│
├── fastcube-chatbot/      # Chatbot service
│
├── docker-compose.yml
└── README.md
```

---

# Frontend

## Installation

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

---

## Frontend Build

Create a production build:

```bash
npm run build
```

The generated files will be available in:

```
frontend/dist/
```

---

## Frontend Docker

Build the frontend image:

```bash
cd frontend

docker build -t fastcube-frontend .
```

Run the container:

```bash
docker run -d \
-p 80:80 \
--name fastcube-frontend \
fastcube-frontend
```

The frontend will be available at:

```
http://localhost
```

---

# Backend

## Installation

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```
backend/.env
```

Example:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=fastcube

JWT_SECRET=your_secret_key
```

---

## Run Backend

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

API URL:

```
http://localhost:5000
```

---

# Docker Compose

From the project root directory:

```bash
docker compose up -d --build
```

Check running containers:

```bash
docker ps
```

Stop services:

```bash
docker compose down
```

---

# Environment Variables

For security reasons, `.env` files are not included in the repository.

Required configuration:

### Backend

```
backend/.env
```

Contains:

* Database credentials
* JWT secret
* SMTP email configuration

### Frontend

```
frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:5000
```

---

# Features

## Authentication

* User registration
* Login system
* JWT authentication
* Protected routes

## Admin Dashboard

* User management
* Services management
* Blog management
* Testimonials management
* Contact management

## Content Management

* Blogs
* Services
* Solutions
* Recommendations
* Tickets

## Chatbot

* AI chatbot integration
* Conversation management
* Intelligent responses

---

# Technologies Used

## Frontend

* React
* Vite
* Tailwind CSS
* JavaScript
* Axios

## Backend

* Node.js
* Express.js
* MySQL
* JWT
* REST API

## DevOps

* Docker
* Docker Compose
* Nginx
* GitHub Actions

---

# Troubleshooting

### Database connection error

Check:

* MySQL service status
* Database credentials
* Backend `.env` configuration

### Port already in use

Change the port in:

```
backend/.env
```

Then restart the application.

---

# Author

Maryam Fajri
