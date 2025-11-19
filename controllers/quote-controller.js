
import Quote from "../models/quotes.js";


/* -----------------------------
   CREATE A NEW QUOTE
----------------------------- */
export const createQuote = async (req, res) => {
    try {
        const userId = req.user.id; // Get logged-in user's ID

        // Extract quote fields from request body
        const {
            customerName,
            customerEmail,
            company,
            phone,
            items,
            totalAmount,
            notes,
        } = req.body;

        // Basic validation to ensure required fields exist
        if (!customerName || !customerEmail || !phone || !items || !totalAmount) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Create new quote document
        const quote = new Quote({
            customerName,
            customerEmail,
            company,
            phone,
            items,
            totalAmount,
            notes,
            createdBy: userId, // associate quote with user
        });

        // Save to DB
        const savedQuote = await quote.save();
        res.status(201).json(savedQuote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* -----------------------------
   GET ALL QUOTES (ADMIN ONLY)
----------------------------- */
export const getAllQuotes = async (req, res) => {
    try {
        // Allow only admins
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
        }

        // Get all quotes and populate user info
        const quotes = await Quote.find().populate("createdBy", "name email");
        res.status(200).json(quotes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* -----------------------------
   GET SINGLE QUOTE BY ID
----------------------------- */
export const getQuoteById = async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id);
        if (!quote) return res.status(404).json({ message: "Quote not found" });

        // Check ownership or admin
        if (quote.createdBy.toString() !== req.user.id && !req.user.admin) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json(quote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* -----------------------------
   UPDATE A QUOTE
----------------------------- */
export const updateQuote = async (req, res) => {
    try {
        // Only admin can update quotes
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
        }

        // Validate required fields
        const { customerName, customerEmail, phone, items, totalAmount } = req.body;
        if (!customerName || !customerEmail || !phone || !items || !totalAmount) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Update the quote
        const updatedQuote = await Quote.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        ).populate("createdBy", "name email");

        if (!updatedQuote) {
            return res.status(404).json({ message: "Quote not found" });
        }

        res.status(200).json(updatedQuote);
    } catch (error) {
        res.status(500).json({
            message: "Error updating quote",
            error: error.message
        });
    }
};

/* -----------------------------
   DELETE A QUOTE (ADMIN ONLY)
----------------------------- */
export const deleteQuote = async (req, res) => {
    try {
        // Only admin can delete quotes
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
        }

        // Check if quote exists first
        const quote = await Quote.findById(req.params.id);
        if (!quote) {
            return res.status(404).json({ message: "Quote not found" });
        }

        // Delete the quote
        await Quote.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Quote deleted successfully",
            deletedQuoteId: req.params.id
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting quote",
            error: error.message
        });
    }
};
/* -----------------------------
   GET LOGGED-IN USER'S QUOTES
----------------------------- */
export const getUserQuotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const quotes = await Quote.find({ createdBy: userId });
        res.status(200).json(quotes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
