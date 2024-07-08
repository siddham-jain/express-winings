const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// to add product
router.post('/', productController.addProduct);

// to get all products
router.get('/', productController.getAllProducts);

// to get products by id
router.get('/:id', productController.getProductById);

// to update a product by id
router.put('/:id', productController.updateProductById);

// to delete a product by id
router.delete('/:id', productController.deleteProductById);

module.exports = router;