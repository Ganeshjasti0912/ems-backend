import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import departmentRouter from './routes/departmentRoute.js';
import employeeRouter from './routes/employee.js';
import connectDB from './db/db.js';
import dashboardRouter from './routes/dashboard.js';
import salaryRouter from './routes/salary.js';
import leaveRouter from './routes/leave.js';
import settingRouter from './routes/setting.js';
//import mongoose from 'mongoose';

dotenv.config(); // Load environment variables
connectDB(); // Connect to MongoDB

const app = express();
app.use(cors(
  {
    origin:"https://ems-frontend-green.vercel.app",
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  }
));
app.use(express.json());
app.use(express.static('public/uploads')); // Serve static files from 'public' directory
app.use('/api/auth', authRouter);
app.use('/api/department', departmentRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/salary', salaryRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/setting', settingRouter); 
app.use('/api/dashboard', dashboardRouter);


// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/DB_EMS')
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('MongoDB connection error:', err));

// Example base route
app.get('/', (req, res) => {
  res.send('EMS Server is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
