import PDFDocument from "pdfkit";
import Quote from "../models/Quotes.js";

export const generateQuotePDF = async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id).populate("createdBy", "name email");
        const PESO_SIGN = '₱';
        if (!quote) {
            return res.status(404).json({ message: "Quote not found" });
        }

        // Check permissions
        if (quote.createdBy._id.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'customer') {
            return res.status(403).json({ message: "Access denied" });
        }

        const doc = new PDFDocument({ margin: 50, size: 'A4' });

        // Set response headers
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=quote_${quote._id}.pdf`);

        doc.pipe(res);

        // --- HEADER ---
        // Logo and Company Info
        doc
            .image('public/logo.png', 50, 45, { width: 50 })
            .fillColor('#444444')
            .fontSize(10)
            .text('UNICOM TECHNOLOGIES', 110, 50)
            .fontSize(10)
            .text('3F Unique Plaza, Sierra Madre St., Highway Hills', 200, 50, { align: 'right' })
            .text('Mandaluyong City, Metro Manila Philippines', 200, 60, { align: 'right' })
            .moveDown(2);

        // Quote Title
        doc
            .fontSize(20)
            .font('Helvetica-Bold')
            .text('QUOTATION', 50, 100, { width: 500, align: 'center' })
            .moveDown(0.5);

        // Quote Info
        const quoteDate = quote.createdAt.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        doc
            .fontSize(10)
            .text(`Quote #: ${quote._id}`, 50, 150)
            .text(`Date: ${quoteDate}`, 50, 165)
            .text(`Prepared By: ${quote.createdBy.name}`, 50, 180)
            .moveDown(2);

        // --- CUSTOMER INFO ---
        doc
            .fontSize(12)
            .font('Helvetica-Bold')
            .text('BILL TO:', 50, 220)
            .font('Helvetica')
            .text(quote.customerName, 50, 235)
            .text(quote.company || '', 50, 250)
            .text(quote.customerEmail, 50, 265)
            .text(quote.phone, 50, 280)
            .moveDown(2);

        // --- ITEMS TABLE ---
        // Table Header
        let y = 320;
        doc
            .font('Helvetica-Bold')
            .fontSize(10)
            .text('DESCRIPTION', 50, y)
            .text('QTY', 350, y)
            .text('UNIT PRICE', 400, y, { width: 80, align: 'right' })
            .text('TOTAL', 500, y, { width: 80, align: 'right' })
            .moveTo(50, y + 10)
            .lineTo(550, y + 10)
            .stroke();

        // Table Rows
        y += 20;
        doc.font('Helvetica');
        quote.items.forEach((item, index) => {
            doc
                .fontSize(10)
                .text(item.description || 'Item ' + (index + 1), 50, y)
                .text(item.quantity.toString(), 350, y)
                .text(`₱${parseFloat(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 400, y, { width: 80, align: 'right' })
                .text(`₱${(item.quantity * item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 500, y, { width: 80, align: 'right' });
            y += 20;
        });

        // Total
        y += 10;
        doc
            .moveTo(400, y)
            .lineTo(550, y)
            .stroke()
            .font('Helvetica-Bold')
            .text('TOTAL:', 400, y + 10, { width: 80, align: 'right' })
            .text(`₱${quote.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 500, y + 10, { width: 80, align: 'right' });

        // --- TERMS & NOTES ---
        y += 50;
        doc
            .font('Helvetica-Bold')
            .fontSize(10)
            .text('TERMS & CONDITIONS', 50, y)
            .font('Helvetica')
            .fontSize(9)
            .text('1. This quote is valid for 30 days from the date of issue.', 50, y + 15)
            .text('2. Prices are subject to change without prior notice.', 50, y + 30)
            .text('3. Delivery terms: FOB Destination', 50, y + 45)
            .text('4. Payment terms: Net 30 days', 50, y + 60)
            .text('5. For any inquiries, please contact our sales team.', 50, y + 75)
            .moveDown(2);

        // Customer Notes
        if (quote.notes) {
            doc
                .font('Helvetica-Bold')
                .text('NOTES:', 50)
                .font('Helvetica')
                .text(quote.notes, { width: 500 })
                .moveDown(1);
        }

        // Footer
        doc
            .fontSize(10)
            .text('Thank you for your business!', 50, 750, { align: 'center', width: 500 })
            .text('Unicom Technologies Asia Pacific - Making Industry Work Better', 50, 765, { align: 'center', width: 500 })
            .text('Tel: (0925) 5000-493 | Email: sales@unicom.com | Socials: www.facebook.com/unicomtechnologiesapinc', 50, 780, { align: 'center', width: 500 });

        doc.end();

    } catch (error) {
        console.error("PDF Generation Error:", error);
        res.status(500).json({
            message: "Error generating PDF",
            error: error.message
        });
    }
};