# Attendly:



**Track every lecture. Stay ahead of your attendance.**

Attendly is a full-stack student attendance tracker and timetable management web application. It helps students manage subjects, organize weekly timetables, mark daily attendance, track attendance performance, analyze trends, manage tasks, and maintain their profile and preferences.

The application uses real PostgreSQL database data and provides a responsive experience across desktop, tablet, and mobile devices.

---

## Features

### Authentication

- User registration
- User login
- JWT authentication
- Protected routes
- Session persistence
- Secure password hashing with bcrypt
- Authenticated user profile
- Logout functionality
- Backend validation and error handling

---

### Dashboard

- Overview of attendance performance
- Subject-based attendance information
- Quick access to important features
- Visual attendance statistics
- Responsive dashboard layout
- Loading and empty states

---

### Subjects Management

Users can manage their academic subjects.

Features include:

- Create subjects
- View subjects
- Update subjects
- Delete subjects
- Subject code
- Faculty information
- Custom subject colors
- User-specific subject data
- Form validation
- Confirmation dialogs
- Toast notifications
- Loading states
- Empty states
- Error states

---

### Weekly Timetable

Users can create and manage their weekly lecture schedule.

Features include:

- Create lectures
- Update lectures
- Delete lectures
- Select subjects for lectures
- Select day of the week
- Set lecture start time
- Set lecture end time
- Add room information
- Weekly timetable view
- Persistent timetable data
- User-specific timetable
- Responsive timetable layout
- Loading states
- Empty states
- Error states

---

### Attendance Management

Users can record and manage their attendance.

Features include:

- Mark attendance as Present
- Mark attendance as Absent
- Daily attendance tracking
- Subject-wise attendance
- Attendance history
- Update attendance records
- Delete attendance records
- Manual attendance records
- Attendance linked with subjects
- Persistent PostgreSQL data
- Toast notifications
- Loading states
- Empty states
- Error states

---

### Attendance Analytics

Attendly provides analytics using real attendance data stored in PostgreSQL.

Features include:

#### Overall Attendance

- Overall attendance percentage
- Total present lectures
- Total absent lectures
- Total lectures
- Best-performing subject
- Lowest-performing subject
- Large donut chart

#### Subject Analytics

- Subject selection dropdown
- Subject attendance percentage
- Present lectures
- Absent lectures
- Total lectures
- Subject donut chart
- Attendance trend data

#### Subject Comparison

- Comparison of all subjects
- Recharts BarChart
- Attendance percentage per subject
- 75% reference line

Attendance colors:

- Above 75% — Forest Green
- Between 60% and 75% — Light Green
- Below 60% — Peach

#### Attendance Summary

Summary cards display:

- Best Subject
- Lowest Subject
- Overall Attendance
- Total Classes

#### Attendance Insights

Rule-based attendance insights are generated without using an AI API.

Examples include:

- Whether overall attendance is above or below 75%
- Lowest attendance subject
- Number of lectures required to improve attendance
- Subject-specific attendance recommendations

All calculations handle:

- No attendance
- Zero attendance
- Only present records
- Only absent records
- Exactly 75%
- Multiple subjects
- Division-by-zero protection

---

### To-Do Management

Users can manage academic and personal tasks.

Features include:

- Create tasks
- Update tasks
- Delete tasks
- Mark tasks as complete
- Mark tasks as pending
- Task priorities
- Task organization
- Persistent database storage
- User-specific tasks
- Loading states
- Empty states
- Error handling

---

### Profile

Users can manage their profile information.

Features include:

- View profile
- Display profile picture
- Display name
- Display email
- Update name
- Update profile image URL
- Authenticated profile API
- Logout access
- Profile loading state
- Profile update toast notifications

---

### Settings

The application provides simple user settings.

Sections include:

- Appearance
- Notifications
- Account

Features include:

- Theme preferences where supported
- Notification preferences stored locally
- Account management
- Logout functionality

---

### Responsive Design

Attendly is designed for multiple screen sizes.

#### Desktop

- Persistent sidebar navigation
- Full dashboard layout
- Responsive charts and tables

#### Tablet

- Collapsible navigation
- Optimized content layout
- Responsive cards and charts

#### Mobile

- Mobile navigation or drawer
- Responsive forms
- Scrollable timetable where required
- Responsive charts
- Mobile-friendly buttons and dialogs

The following pages are optimized for responsive use:

- Dashboard
- Subjects
- Timetable
- Attendance
- Analytics
- To-Dos
- Profile
- Settings

---

### UI and UX

The application uses a consistent design system.

Color palette:

- Forest Green: `#224F10`
- Light Green: `#E8F2E3`
- Cream: `#FFF4E8`
- Peach: `#FFD6C2`

UI improvements include:

- Consistent spacing
- Consistent typography
- Reusable cards
- Reusable buttons
- Reusable inputs
- Accessible dialogs
- Toast notifications
- Skeleton loading states
- Empty states
- Error states
- Responsive layouts
- Visible focus states

---

### Accessibility

Attendly includes accessibility improvements such as:

- Keyboard navigation
- Visible focus states
- Accessible form labels
- ARIA labels where required
- Accessible buttons
- Accessible dialogs
- Improved color contrast
- Semantic UI structure

---

### Loading States

Skeleton loading states are available across the application where appropriate.

Supported areas include:

- Dashboard
- Subjects
- Timetable
- Attendance
- Analytics
- Profile
- To-Dos

---

### Error States

The application uses reusable error state components.

Error states support:

- Error title
- Error message
- Retry functionality

---

### Empty States

Reusable empty state components provide a consistent experience when no data is available.

Used across features such as:

- Subjects
- Timetable
- Attendance
- Analytics
- To-Dos

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand
- React Hook Form
- Zod
- Lucide React
- Recharts

### Backend

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcrypt
- Zod validation

---

## Project Structure

```text
attendly/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── analytics/
│   │   │   ├── attendance/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── layout/
│   │   │   ├── subjects/
│   │   │   ├── timetable/
│   │   │   ├── todos/
│   │   │   ├── toast/
│   │   │   └── ui/
│   │   │
│   │   ├── layouts/
│   │   │   └── AppLayout.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── SubjectsPage.tsx
│   │   │   ├── TimetablePage.tsx
│   │   │   ├── AttendancePage.tsx
│   │   │   ├── AnalyticsPage.tsx
│   │   │   ├── TodosPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   └── SettingsPage.tsx
│   │   │
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   ├── utils/
│   │   └── hooks/
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.ts
│
├── server/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── types/
│   │   ├── utils/
│   │   └── validators/
│   │
│   ├── .env
│   └── package.json
│
└── README.md
````

---

## Prerequisites

Before running Attendly, install:

* Node.js 18 or later
* npm
* PostgreSQL 13 or later

You can use:

* Local PostgreSQL
* Railway PostgreSQL
* Neon
* Supabase
* Any compatible PostgreSQL provider

---

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
cd attendly
```

Install server dependencies:

```bash
cd server
npm install
```

Install client dependencies:

```bash
cd ../client
npm install
```

---

## Environment Variables

### Client

Create:

```text
client/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000
```

---

### Server

Create:

```text
server/.env
```

Example:

```env
PORT=5000
NODE_ENV=development

CLIENT_URL=http://localhost:5173

DATABASE_URL="your_postgresql_connection_string"

JWT_SECRET="your_secure_jwt_secret"

JWT_EXPIRES_IN=7d
```

If Vite runs on another port such as `5174` or `5175`, make sure that origin is allowed by the server CORS configuration.

---

## Database Setup

From the `server` directory:

```bash
npm run prisma:generate
```

Apply migrations:

```bash
npm run prisma:migrate:deploy
```

For development where you need to create a new migration:

```bash
npm run prisma:migrate
```

Open Prisma Studio:

```bash
npm run prisma:studio
```

---

## Local Development

Run the backend and frontend in separate terminals.

### Terminal 1 — Backend

```bash
cd attendly/server
npm install
npm run prisma:generate
npm run prisma:migrate:deploy
npm run dev
```

The API runs on:

```text
http://localhost:5000
```

---

### Terminal 2 — Frontend

```bash
cd attendly/client
npm install
npm run dev
```

Vite will display the local application URL.

Usually:

```text
http://localhost:5173
```

or another available port such as:

```text
http://localhost:5174
```

or:

```text
http://localhost:5175
```

Open the URL shown in the Vite terminal.

---

## Production Build

### Backend

```bash
cd server
npm run prisma:generate
npm run build
npm start
```

Check TypeScript:

```bash
npm run typecheck
```

---

### Frontend

```bash
cd client
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## API Reference

### Authentication

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| POST   | `/api/auth/register` | Create a new account   |
| POST   | `/api/auth/login`    | Login                  |
| GET    | `/api/auth/me`       | Get authenticated user |
| POST   | `/api/auth/logout`   | Logout                 |

---

### Subjects

| Method | Endpoint            | Description    |
| ------ | ------------------- | -------------- |
| GET    | `/api/subjects`     | Get subjects   |
| POST   | `/api/subjects`     | Create subject |
| GET    | `/api/subjects/:id` | Get subject    |
| PUT    | `/api/subjects/:id` | Update subject |
| DELETE | `/api/subjects/:id` | Delete subject |

---

### Timetable

| Method | Endpoint             | Description    |
| ------ | -------------------- | -------------- |
| GET    | `/api/timetable`     | Get timetable  |
| POST   | `/api/timetable`     | Create lecture |
| PUT    | `/api/timetable/:id` | Update lecture |
| DELETE | `/api/timetable/:id` | Delete lecture |

---

### Attendance

The attendance API supports attendance creation, updates, deletion, daily tracking, and attendance history for authenticated users.

Attendance records are user-specific and associated with subjects.

---

### Analytics

| Method | Endpoint                     | Description                      |
| ------ | ---------------------------- | -------------------------------- |
| GET    | `/api/analytics/overall`     | Get overall attendance analytics |
| GET    | `/api/analytics/subjects`    | Get subject-wise analytics       |
| GET    | `/api/analytics/subject/:id` | Get detailed subject analytics   |

---

### Profile

| Method | Endpoint       | Description               |
| ------ | -------------- | ------------------------- |
| GET    | `/api/profile` | Get authenticated profile |
| PUT    | `/api/profile` | Update profile            |

---

### To-Dos

The To-Do API supports authenticated users in creating, updating, completing, and deleting tasks.

---

## Authentication

Protected endpoints require a JWT token.

Send the token using:

```text
Authorization: Bearer <token>
```

Passwords are securely hashed using bcrypt.

User data is isolated so one user cannot access another user's:

* Subjects
* Timetable
* Attendance
* Analytics
* To-Dos
* Profile information

---

## Deployment

Attendly can be deployed as:

1. PostgreSQL Database
2. Node.js Backend
3. Static React Frontend

### Backend Deployment

Typical build command:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate:deploy
npm run build
```

Start command:

```bash
npm start
```

Required environment variables:

```text
PORT
NODE_ENV
CLIENT_URL
DATABASE_URL
JWT_SECRET
JWT_EXPIRES_IN
```

---

### Frontend Deployment

Build:

```bash
npm install
npm run build
```

Deploy the generated:

```text
client/dist
```

Set:

```env
VITE_API_URL=https://your-api-url.com
```

For React Router, configure your hosting provider with an SPA fallback so routes correctly resolve to:

```text
index.html
```

---

## Testing Checklist

Before deployment, verify:

### Backend

* [ ] Server starts successfully
* [ ] Prisma Client generates successfully
* [ ] Database migrations apply successfully
* [ ] TypeScript compilation succeeds
* [ ] Authentication works
* [ ] Protected endpoints reject unauthorized requests
* [ ] Subjects CRUD works
* [ ] Timetable CRUD works
* [ ] Attendance operations work
* [ ] Analytics uses real database data
* [ ] Profile update works
* [ ] To-Do operations work

### Frontend

* [ ] Client builds successfully
* [ ] Signup works
* [ ] Login works
* [ ] Session persists after refresh
* [ ] Logout works
* [ ] Subjects work
* [ ] Timetable works
* [ ] Attendance works
* [ ] Analytics works
* [ ] To-Dos work
* [ ] Profile works
* [ ] Settings work
* [ ] Sidebar navigation works
* [ ] Mobile navigation works
* [ ] Toast notifications work
* [ ] Loading states work
* [ ] Empty states work
* [ ] Error states work

---

## Future Scope

The following features can be added in future versions of Attendly.

### Smart Attendance Predictions

* Predict future attendance percentage
* Show attendance risk warnings
* Estimate whether a student can meet minimum attendance requirements
* Forecast attendance based on timetable and previous records

### Notifications and Reminders

* Lecture reminders
* Attendance marking reminders
* Low attendance warnings
* Upcoming task reminders
* Daily or weekly summaries

### Advanced Analytics

* Monthly attendance reports
* Weekly attendance trends
* Semester-wise analytics
* Downloadable attendance reports
* PDF report generation
* CSV export
* Advanced charts and trends

### Goal Management

* Set attendance goals
* Track progress toward attendance goals
* Subject-specific attendance targets
* Personalized recommendations

### Calendar Integration

* Calendar view for lectures
* Google Calendar integration
* Upcoming lecture notifications
* Exam and assignment reminders

### Academic Task Management

* Assignment deadlines
* Exam schedules
* Study plans
* Task categories
* Recurring tasks
* Priority-based reminders

### Profile Improvements

* Direct profile image upload
* Cloud image storage
* Account deletion
* Password change
* Email verification
* Password reset

### Security Improvements

* Refresh tokens
* Token revocation
* Logout from all devices
* Email verification
* Password reset
* Rate limiting
* Two-factor authentication

### Social and Collaboration Features

* Share timetables
* Study group planning
* Collaborative task lists
* Classmate reminders

### Progressive Web App

* Install Attendly as an app
* Offline support
* Push notifications
* Background synchronization

### Mobile Application

* Native Android application
* Native iOS application
* React Native mobile application
* Mobile notifications

### Institution Features

* Teacher accounts
* Classroom management
* Student attendance reports
* Department dashboards
* Administrative analytics
* Role-based access control

---

## License

This project is intended for educational and academic use.

---

## Author

Bhagyashri Joshi

Developed as a full-stack attendance tracking and academic productivity application using React, Node.js, Express, PostgreSQL, and Prisma.
