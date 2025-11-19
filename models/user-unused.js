import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please enter your name"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlenght: [6, "Password must be at least 6 characters Long"],
    },
    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer"
    },
},
    { timestamps: true });

export default mongoose.model("User", userSchema);
