const productTable = require('../models/product');

let addProduct = async (req, res) => {
    const product = new productTable(req.body);
    try {
        await product.save();
        res.json(product);
    } catch (err) {
        res.status(400).send;
    }
}

let getAllProducts = async (req, res) => {
    const allProducts = await productTable.find();
    res.json(allProducts);
}

let getProductById = async (req, res) => {
    try {
        const product = await productTable.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error getting product by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

let deleteProductById = async (req, res) => {
    try{
        const deletedProduct = await productTable.findByIdAndDelete(req.params.id);
        res.json(deletedProduct);
    } catch (err) {
        res.status(404).send('Product not found');
    }
}

let updateProductById = async(req, res) => {
    try {
        const updatedProduct = await productTable.findByIdAndUpdate(req.params.id, req.body);
        res.json(updatedProduct);
    } catch(err){
        res.status(404).send('Product not found');
    }
}

module.exports = {
    addProduct,
    getAllProducts,
    getProductById,
    deleteProductById,
    updateProductById
}

