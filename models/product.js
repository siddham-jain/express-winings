const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    "product_name" : {
        "type" : "String",
        "require" : true
    },
    "product_price" : {
        "type" : "Number",
        "require" : true
    },
    "isInStock" : {
        "type" : "Boolean",
        "require" : true
    },
    "category" : {
        "type" : "String",
        "require" : true
    }
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;