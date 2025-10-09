import user from "../models/userModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const createToken = (user) =>
    jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

export const registerUser = async (res, req) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: "Name, email, and password are required." });

        const exist = await User.findOne({ email });
        if (exist) return res.status(409).json({ message: "Email already registered" });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed, role: role || "customer" });


        const token = createToken(user);
        res.status(201).json({
            message: "User registered",
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid credentials." });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Invalid credentials." });

        const token = createToken(user);
        res.json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};