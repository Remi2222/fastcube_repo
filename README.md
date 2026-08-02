# FastCube Project

## Overview

This repository contains a React/Vite frontend and an Express backend.

- `frontend/`: React app using Vite
- `backend/`: Node.js API server with Express, MySQL, JWT auth, file uploads, and email support

## Backend

### Setup

1. Go to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your database and email settings.

### Run

- Development:
  ```bash
  npm run dev
  ```
- Production:
  ```bash
  npm start
  ```

### Docker

Build and run the backend image:

```bash
docker build -t fastcube-backend -f backend/Dockerfile ./backend
docker run -d --rm -p 5000:5000 --name fastcube-backend fastcube-backend
```

## Frontend

### Setup

1. At project root:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```

### Build

```bash
npm run build
```

### Docker

Build and run the frontend image:

```bash
docker build -t fastcube-frontend .
docker run -d --rm -p 80:80 --name fastcube-frontend fastcube-frontend
```

## Environment Notes

- Backend uses `backend/.env`.
- If port `5000` is occupied, change `PORT` in `backend/.env` and rerun.
- For Gmail SMTP, use an app password or valid email credentials.

## Known Issues

- The backend may fail if MySQL credentials are invalid or the database server is unreachable.
- The sample `.env` file includes placeholder values.
