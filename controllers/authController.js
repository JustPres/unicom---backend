import User from "../models/userModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const createToken = (user) =>
    jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required." });
        }

        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(401).json({ message: "Email already registered" });
        }

        const hashed = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashed,
            role: role || "customer",
        });

        const token = createToken(newUser);
        res.status(201).json({
            message: "User registered",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "Email and password are required." });

        const foundUser = await User.findOne({ email });
        if (!foundUser) return res.status(401).json({ message: "Invalid credentials." });

        const match = await bcrypt.compare(password, foundUser.password);
        if (!match) return res.status(401).json({ message: "Invalid credentials." });

        const token = createToken(foundUser);
        res.json({
            message: "Login successful",
            token,
            user: {
                id: foundUser._id,
                name: foundUser.name,
                email: foundUser.email,
                role: foundUser.role,
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
