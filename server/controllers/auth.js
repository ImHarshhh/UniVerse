import User from '../models/Users.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not defined in environment variables");
        throw new Error("JWT_SECRET is not configured");
    }
    
    try {
        const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        console.log("Token successfully generated for user:", id);
        return token;
    } catch (error) {
        console.error("Error generating token:", error.message);
        throw error;
    }
};

// Signup Controller
export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const newUser = new User({
            username,
            email: email.toLowerCase(),
            password
        });

        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            token: generateToken(newUser._id),
        });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ message: "Server error, please try again later." });
    }
};

// Login Controller
export const login = async (req, res) => {
    const { email, password } = req.body;

    console.log("Login attempt for:", email);

    if (!email || !password) {
        console.log("Missing credentials");
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.log("User not found with email:", email);
            return res.status(400).json({ message: "User not found" });
        }

        // console.log("Stored password:", user.password); // Keep this commented out in production
        
        //Password Comparison Logic
        const isMatch = await user.matchPassword(password);
        console.log("Password match status:", isMatch);

        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate token and ensure it's not undefined
        const generatedToken = generateToken(user._id);

        // Add a check here just before sending the response
        if (!generatedToken) {
            console.error("Login: Token generation failed, sending 500 error.");
            return res.status(500).json({ message: "Failed to generate authentication token." });
        }

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isSubscribed: user.isSubscribed,
            anonPostCount: user.anonPostCount,
            token: generatedToken // Use the explicitly generated token
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server error, please try again later." });
    }
};

// Logout Controller
export const logout = async (req, res) => {
    try {
        // Clear the token from cookies if it exists
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error during logout' });
    }
};