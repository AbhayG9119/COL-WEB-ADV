# MERN Stack Contact Form with Admin Panel

## Overview

This project is a full MERN stack application with a contact form and an admin panel. The backend is built with Node.js, Express, MongoDB, and Mongoose. The frontend is built with React and React Router.

## Features

- Public contact form to submit inquiries
- Admin login with JWT authentication
- Admin dashboard to view contact submissions
- Dashboard stats including total and today's submissions
- Search, pagination, and CSV export of contacts
- Secure backend with Helmet, CORS, and rate limiting
- Email notifications on contact form submission

## Environment Variables

Create a `.env` file in the `Backend` folder based on `.env.example` with the following variables:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_email_app_password
FROM_NAME=College Admin
FROM_EMAIL=admin@college.com
ADMIN_EMAIL=your_admin_email@gmail.com
```

## Backend Setup

1. Navigate to the `Backend` folder:

```bash
cd Backend
```

2. Install dependencies:

```bash
npm install
```

3. Seed an admin user (optional):

```bash
node src/scripts/seedAdmin.js
```

4. Start the backend server:

```bash
npm run dev
```

The backend server will run on `http://localhost:5000`.

## Frontend Setup

1. Navigate to the `Frontend` folder:

```bash
cd Frontend
```

2. Install dependencies (ensure `axios` is installed):

```bash
npm install
```

3. Start the frontend development server:

```bash
npm start
```

The frontend will run on `http://localhost:3000`.

## Usage

- Access the public contact form at `/contact`.
- Admin login page is at `/admin/login`.
- After login, access the admin dashboard at `/admin/dashboard`.

## Notes

- Ensure MongoDB Atlas connection string and SMTP credentials are correctly set in `.env`.
- The admin dashboard is protected and requires a valid JWT token.
- The contact form sends email notifications to the admin email.

## License

MIT License
