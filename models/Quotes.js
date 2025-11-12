// Import mongoose to define our MongoDB schema and model
import mongoose from "mongoose";

// Define the structure (schema) for a Quote document
const quoteSchema = new mongoose.Schema(
    {
        // Name of the customer requesting the quote
        customerName: {
            type: String,
            required: true, // Required means this field must be filled
        },

        // Customer's email (for communication or PDF sending)
        customerEmail: {
            type: String,
            required: true,
        },

        // Optional field for the customer's company name
        company: {
            type: String,
        },

        // Contact number of the customer
        phone: {
            type: String,
            required: true,
        },

        // List of products or services being quoted
        // Each item can have name, quantity, and price
        items: [
            {
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
            },
        ],

        // Total price for all items combined
        totalAmount: {
            type: Number,
            required: true,
        },

        // Status of the quote: pending, approved, or rejected
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending", // Default value when created
        },

        // Notes or remarks added by admin or user
        notes: {
            type: String,
        },

        // Expiration date for the quote (optional)
        expiresAt: {
            type: Date,
            default: () => {
                // Automatically set to 7 days from now
                const now = new Date();
                now.setDate(now.getDate() + 7);
                return now;
            },
        },

        // Reference to the user who created the quote (from User model)
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Links the quote to a specific user
            required: true,
        },
    },
    {
        // Automatically adds createdAt and updatedAt timestamps
        timestamps: true,
    }
);

// Create the model (collection) called "Quote"
const Quote = mongoose.model("Quote", quoteSchema);

// Export the model to use it in controllers
export default Quote;
