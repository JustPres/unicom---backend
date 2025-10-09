// config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error("MONGO_URI not set in .env");
        process.exit(1);
    }
    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
};

export default connectDB;
