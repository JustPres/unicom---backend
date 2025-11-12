import PDFDocument from "pdfkit";
import Quote from "../models/Quotes.js";

/* -----------------------------
   Generate a Professional Quote PDF
----------------------------- */
export const generateQuotePDF = async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id).populate("createdBy", "name email");

        if (!quote) return res.status(404).json({ message: "Quote not found" });

        // Ensure only the owner or admin can export
        if (quote.createdBy._id.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied" });
        }

        // Create a new PDF document
        const doc = new PDFDocument();

        // Set response headers to tell browser it’s a PDF
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=quote_${quote._id}.pdf`);

        // Pipe the document directly to the response
        doc.pipe(res);

        // --- HEADER SECTION ---
        doc
            .fontSize(22)
            .text("UNICOM QUOTATION", { align: "center" })
            .moveDown(1);

        // --- COMPANY INFO ---
        doc
            .fontSize(12)
            .text("Unicom Industrial Solutions", { align: "center" })
            .text("123 Main St, Manila, Philippines", { align: "center" })
            .text("Email: contact@unicom.com | Phone: +63 912 345 6789", { align: "center" })
            .moveDown(2);

        // --- CUSTOMER INFO ---
        doc
            .fontSize(14)
            .text(`Customer Name: ${quote.customerName}`)
            .text(`Email: ${quote.customerEmail}`)
            .text(`Company: ${quote.company || "N/A"}`)
            .text(`Phone: ${quote.phone}`)
            .moveDown(1);

        // --- QUOTE INFO ---
        doc
            .text(`Quote ID: ${quote._id}`)
            .text(`Created By: ${quote.createdBy.name} (${quote.createdBy.email})`)
            .moveDown(2);

        // --- ITEMS TABLE ---
        doc.fontSize(14).text("Items:", { underline: true }).moveDown(0.5);
        quote.items.forEach((item, i) => {
            doc.fontSize(12).text(`${i + 1}. ${item.name} - ₱${item.price.toLocaleString()}`);
        });
        doc.moveDown(1);

        // --- TOTAL ---
        doc
            .fontSize(16)
            .text(`Total Amount: ₱${quote.totalAmount.toLocaleString()}`, { align: "right", bold: true })
            .moveDown(1);

        // --- NOTES ---
        if (quote.notes) {
            doc.fontSize(12).text("Notes:", { underline: true }).moveDown(0.3);
            doc.text(quote.notes);
        }

        // --- FOOTER ---
        doc.moveDown(3);
        doc
            .fontSize(10)
            .text("Thank you for choosing Unicom Technologies.", { align: "center" });

        // Finalize PDF file
        doc.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
