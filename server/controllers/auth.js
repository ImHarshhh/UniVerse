import User from '../models/Users.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Signup Controller
export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // ❗ Removed extra hashing here. The model already hashes the password.
        const newUser = new User({ 
            username, 
            email: email.toLowerCase(), 
            password // No need to hash here
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

        console.log("Stored password:", user.password);
        
        //Password Comparison Logic
        const isMatch = await user.matchPassword(password);
        console.log("Password match status:", isMatch);

        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isSubscribed: user.isSubscribed,
            anonPostCount: user.anonPostCount,
            token: generateToken(user._id)
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server error, please try again later." });
    }
};
