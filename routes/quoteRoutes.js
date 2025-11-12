import express from "express";

import {
   createQuote,
   getAllQuotes,
   getQuoteById,
   updateQuote,
   deleteQuote,
   getUserQuotes,
} from "../controllers/quoteController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js"; //  Auth middlewares
import { generateQuotePDF } from "../controllers/pdfController.js"; //  For business-style export

const router = express.Router();

/* -----------------------------
   CREATE a new quote
   - Requires login
   - Normal users can create their own quote
----------------------------- */
router.post("/", protect, createQuote);

/* -----------------------------
   GET ALL quotes (Admin only)
   - Only admin can see all users' quotes
----------------------------- */
router.get("/", protect, adminOnly, getAllQuotes);

/* -----------------------------
   GET LOGGED-IN USER’S quotes
   - Normal user can view their own created quotes
----------------------------- */
router.get("/my", protect, getUserQuotes);

/* -----------------------------
   GET SINGLE quote by ID
   - Only the owner or an admin can access
----------------------------- */
router.get("/:id", protect, getQuoteById);

/* -----------------------------
   UPDATE a quote (Admin only)
----------------------------- */
router.put("/:id", protect, adminOnly, updateQuote);

/* -----------------------------
   DELETE a quote (Admin only)
----------------------------- */
router.delete("/:id", protect, adminOnly, deleteQuote);

/* -----------------------------
   EXPORT quote as PDF
   - Any logged-in user can export their own quote
----------------------------- */
router.get("/:id/export", protect, generateQuotePDF);

export default router;
