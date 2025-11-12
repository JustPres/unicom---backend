import jwt from "jsonwebtoken";
import User from "../models/userModels.js";

// In authMiddleware.js, update the protect middleware
export const protect = async (req, res, next) => {
    try {
        console.log('Authorization header:', req.headers.authorization); // Log the auth header

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            console.log('No token found in request');
            return res.status(401).json({ message: "No token provided" });
        }

        console.log('Token found, verifying...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            console.log('User not found in database');
            return res.status(401).json({ message: "User not found" });
        }

        console.log('User found in DB:', {
            id: user._id,
            email: user.email,
            role: user.role
        });

        req.user = user;
        next();
    } catch (err) {
        console.error('Auth error:', err.message);
        res.status(401).json({
            message: "Token invalid or expired",
            error: err.message  // Include the actual error message
        });
    }
};

export const adminOnly = (req, res, next) => {
    console.log('User from token:', req.user); // Add this line
    console.log('User role:', req.user?.role); // Add this line

    if (!req.user) {
        console.log('No user in request'); // Add this line
        return res.status(401).json({ message: "Not authenticated" });
    }
    if (req.user.role !== "admin") {
        console.log('User is not admin'); // Add this line
        return res.status(403).json({ message: "Admin access only" });
    }
    console.log('User is admin, proceeding'); // Add this line
    next();
};
