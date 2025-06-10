import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { syncIndexes } from 'mongoose';

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '10d' }
        );

        // Return user data including name
        res.status(200).json({
            success: true,
            token,
            user: {
                userId: user._id,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const verify = async (req, res) => {
    return res.status(200).json({
        success: true,
        user: {
            userId: req.user._id,
            name: req.user.name,      // ✅ Include name explicitly
            role: req.user.role
        }
    });
};

export { login, verify };
