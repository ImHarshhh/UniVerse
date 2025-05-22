import jwt from 'jsonwebtoken';
import User from '../models/Users.js';

export const protect = async (req, res, next) => {
    const token = 
        req.headers.authorization?.startsWith('Bearer') 
            ? req.headers.authorization.split(' ')[1]
            : req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token missing or invalid.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.status(404).json({ message: 'User not found. Please register or log in.' });
        }

        next();
    } catch (error) {
        const errorMessages = {
            TokenExpiredError: 'Session expired, please log in again.',
            JsonWebTokenError: 'Invalid token, please log in again.',
        };

        const errorMessage = errorMessages[error.name] || 'Server error while validating token';
        return res.status(401).json({ message: errorMessage });
    }
};
