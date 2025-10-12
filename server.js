// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./Routes/auth.js";
import productRoutes from './routes/productRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());            // Allow cross-origin requests (configure origin for production)
app.use(express.json());    // Parse JSON bodies
app.use("/api/products", productRoutes);
// Connect to database
connectDB();

// Simple health route
app.get("/", (req, res) => {
    res.json({ message: "Unicom backend is up 🚀" });
});



// Mount routes
app.use("/api/auth", authRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
