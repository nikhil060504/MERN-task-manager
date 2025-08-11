# Task Manager Application

A full-stack task management application with authentication, real-time stats, recurring tasks, calendar view, email notifications, and advanced date filtering. Built with React, Redux, Tailwind CSS, Node.js, Express, and MongoDB with Mongoose.

---

## Features

- JWT authentication and role-based access control
- Responsive UI with Tailwind CSS
- Real-time task stats and category filters
- **Advanced Date Filtering**: Filter tasks by today, this week, this month, custom date ranges, specific year/month/day
- Recurring tasks and calendar view
- Daily summary emails via cron jobs and Nodemailer
- Optimized dashboard with React useMemo and backend pagination
- Server-side filtering and sorting for better performance
- Environment-specific deployment configurations

---

## Tech Stack

- **Frontend:** React, Redux, Tailwind CSS, React Big Calendar, Framer Motion
- **Backend:** Node.js, Express, MongoDB with Mongoose, JWT, Nodemailer, node-cron

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd Task-Manager-Application
   ```

2. **Install backend dependencies:**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables:**
   - Create a `.env` file in the `backend` folder with the following:
     ```env
     DB_DIALECT=mysql # or postgres or sqlite
     DB_HOST=localhost
     DB_PORT=3306
     DB_NAME=taskmanager
     DB_USER=your_db_user
     DB_PASS=your_db_password
     ACCESS_TOKEN_SECRET=your_jwt_secret
     EMAIL_USER=your_email@example.com
     EMAIL_PASS=your_email_password
     NODE_ENV=development
     PORT=5000
     ```

---

## Running the Application

### Start Backend

```bash
cd backend
npm start
```

### Start Frontend

```bash
cd frontend
npm start
```

- Frontend runs on [http://localhost:3000](http://localhost:3000)
- Backend runs on [http://localhost:5000](http://localhost:5000)

---

## Folder Structure

```
Task-Manager-Application/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── data/
│   ├── app.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── api/
│   │   ├── validations/
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

---

## Key Scripts

### Backend

- `npm start` — Start the Express server
- `npm run dev` — Start server with nodemon (if configured)

### Frontend

- `npm start` — Start React development server
- `npm run build` — Build for production

---

## API Endpoints (Backend)

- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/login` — Login
- `GET /api/profile` — Get user profile
- `GET /api/tasks` — Get tasks (with filters, pagination)
- `POST /api/tasks` — Create a task
- `PUT /api/tasks/:id` — Update a task
- `DELETE /api/tasks/:id` — Delete a task
- `POST /api/tasks/bulk` — Bulk create tasks
- `GET /api/tasks/events` — Get calendar events
- `GET /api/tasks/stats` — Get task stats
- `GET /api/tasks/completion-graph` — Get weekly completion graph

---

## Environment Variables

- `DB_DIALECT` — Database dialect (mysql, postgres, sqlite)
- `DB_HOST` — Database host
- `DB_PORT` — Database port
- `DB_NAME` — Database name
- `DB_USER` — Database user
- `DB_PASS` — Database password
- `ACCESS_TOKEN_SECRET` — JWT secret
- `EMAIL_USER` — Email for sending notifications
- `EMAIL_PASS` — Email password/app password
- `NODE_ENV` — Environment (development/production)
- `PORT` — Backend server port

---

## Deployment

- Use environment-specific `.env` files for production and development
- Build frontend with `npm run build` and serve with Express in production
- Configure email and database credentials securely

---

## License

This project is licensed under the MIT License.

---

## Credits

- [React Big Calendar](https://github.com/jquense/react-big-calendar)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Nodemailer](https://nodemailer.com/)

---

## Contact

For questions or support, please open an issue or contact the maintainer.
