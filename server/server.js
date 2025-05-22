import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/post.js';
import userRoutes from './routes/user.js'; // ✅ Import new user route
import cookieParser from 'cookie-parser';
import { protect } from './middleware/authMiddleware.js';

dotenv.config();
const app = express();

// Connect to Database
connectDB(); // Move this up before starting the server

// Configure CORS
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Route middleware
app.use('/api/auth', authRoutes);
app.use('/api/posts', protect, postRoutes);
app.use('/api/users', protect, userRoutes); // ✅ Protected user route

// Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working successfully!' });
});

// Root Route
app.get('/', (req, res) => res.send('API Running...'));

// Port Configuration
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
