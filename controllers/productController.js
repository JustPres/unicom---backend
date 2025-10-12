import Product from '../models/Product.js';

// get all products
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ messsage: err.message });
    }
};

// Get single product
export const getProductsById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// create new product 
export const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const saved = await product.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update product
export const updateProduct = async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updated) return res.status(404).json({ message: "Product not found" });
        res.status(400).json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete product 
export const deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Product not found" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

