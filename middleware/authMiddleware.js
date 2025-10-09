import jwt from "jsonwebtoken";
import User from "../models/userModels.js";

export const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startwidth("Beared")) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split("")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (err) {
        res.status(401).json({ message: "Token invalid or expired" })
    }
};

export const adminOnly = (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access only" });
    next();
}