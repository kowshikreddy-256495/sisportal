# Student Information System (SIS)

A comprehensive web-based Student Information System with features for student management, course enrollment, attendance tracking, grade management, and fee payment.

## Features

### User Management
- User registration and login (Student, Teacher, Admin)
- Profile management and updates
- Password security with bcryptjs

### Student Features
- Dashboard with academic overview
- View enrolled courses with details
- Check grades and GPA calculation
- Track attendance records and percentage
- View and pay semester fees
- Edit personal profile

### Course Management
- Browse available courses
- View course details (code, credits, schedule)
- Course enrollment
- Track course assignments

### Attendance System
- Mark student attendance
- View attendance records by course
- Calculate attendance percentage
- Leave tracking

### Grade Management
- Automatic grade calculation (Assignment 20%, Midterm 30%, Final 50%)
- Grade point assignment (A, B, C, D, F)
- GPA calculation
- Semester-wise grade reports

### Fee Management
- View fee schedules
- Track payment status (Pending, Partial, Paid)
- Online fee payment
- Payment history

### Admin Features
- Manage users (create, update)
- Create and manage courses
- View all student records
- Mark attendance
- Upload grades
- Generate reports

## Technology Stack

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time notifications

### Frontend
- **React** - UI library
- **CSS3** - Styling
- **Axios** - HTTP client

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/sisDB
JWT_SECRET=your-secret-key
NODE_ENV=development
```

4. Start the server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Students
- `GET /api/students` - Get all students (Admin)
- `GET /api/students/:id` - Get student by ID
- `GET /api/students/profile/me` - Get current student profile
- `POST /api/students` - Create student (Admin)
- `PUT /api/students/:id` - Update student (Admin)
- `POST /api/students/:id/enroll` - Enroll in course

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (Admin)
- `PUT /api/courses/:id` - Update course (Admin)
- `DELETE /api/courses/:id` - Delete course (Admin)
- `POST /api/courses/:id/students` - Add student to course (Admin)

### Attendance
- `GET /api/attendance` - Get all attendance records
- `GET /api/attendance/student/:studentId` - Get student attendance
- `GET /api/attendance/course/:courseId` - Get course attendance
- `POST /api/attendance` - Mark attendance (Admin)
- `GET /api/attendance/:studentId/:courseId/percentage` - Get attendance percentage

### Grades
- `GET /api/grades` - Get all grades
- `GET /api/grades/student/:studentId` - Get student grades
- `GET /api/grades/course/:courseId` - Get course grades
- `POST /api/grades` - Create grade record (Admin)
- `PUT /api/grades/:id` - Update grade (Admin)

### Fees
- `GET /api/fees` - Get all fees
- `GET /api/fees/student/:studentId` - Get student fees
- `POST /api/fees` - Create fee record (Admin)
- `PUT /api/fees/:id/pay` - Pay fee
- `PUT /api/fees/:id` - Update fee (Admin)

## Sample Data

### Test User Credentials

**Admin:**
- Email: admin@sis.com
- Password: admin123
- Role: admin

**Teacher:**
- Email: teacher@sis.com
- Password: teacher123
- Role: teacher

**Student:**
- Email: student@sis.com
- Password: student123
- Role: student

## Project Structure

```
├── server/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── courseController.js
│   │   ├── attendanceController.js
│   │   ├── gradeController.js
│   │   └── feeController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Course.js
│   │   ├── Attendance.js
│   │   ├── Grade.js
│   │   └── Fee.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── gradeRoutes.js
│   │   └── feeRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
│
└── client/
    ├── src/
    │   ├── pages/
    │   │   ├── LoginPage.js
    │   │   ├── Dashboard.js
    │   │   ├── Courses.js
    │   │   ├── Grades.js
    │   │   ├── Attendance.js
    │   │   ├── Fees.js
    │   │   └── Profile.js
    │   ├── App.js
    │   ├── App.css
    │   ├── index.css
    │   └── index.js
    └── package.json
```

## Key Features Explained

### Authentication & Authorization
- JWT-based authentication with role-based access control
- Three user roles: Student, Teacher, Admin
- Secure password hashing with bcryptjs

### Dashboard
- Real-time overview of academic information
- Quick access to all features
- Statistics cards showing enrollment, GPA, attendance, and fees

### Grade Calculation
- Automatic calculation: Assignment (20%) + Midterm (30%) + Final (50%)
- Letter grade assignment based on total score
- GPA calculation from all courses

### Attendance Management
- Daily attendance marking by teachers
- Automatic attendance percentage calculation
- Leave tracking capability

### Fee Management
- Semester-based fee tracking
- Multiple payment status options
- Payment history and receipts

## Future Enhancements

- Email notifications for fees and grades
- SMS alerts
- Document upload (certificates, transcripts)
- Advanced reporting and analytics
- Mobile app support
- Payment gateway integration (Stripe, PayPal)
- Video conferencing for classes
- Assignment submission and grading
- Notifications and messaging system

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running on your system
- Check the connection string in `.env`
- Verify database name in connection string

### Port Already in Use
- Change the PORT in `.env`
- Or kill the process using the port

### CORS Error
- Ensure server and client are running on different ports
- Check CORS configuration in server.js

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please create an issue in the repository.
