const express = require('express');
const fs = require('fs');
require('dotenv').config();

const app = express();
const path = require('path');
app.use(express.json()); //middleware for passing json objects

// const bodyParser = require('body-parser');

// Middleware to parse JSON bodies
// app.use(bodyParser.json());

const morgan = require('morgan');
app.use(morgan('combined')); //middleware for logging activities

const logger = (req, res, next) => {
    const hostname = req.hostname;
    const date = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    console.log(`[${date}] ${hostname} ${method} ${url}`);
    next();
};

const coursesFilePath = path.join(__dirname, 'courses.json');

const readFromFile = (filePath) => {
    try {
        return JSON.parse(fs.readFileSync(filePath));
    } catch(error){
        console.log("Error reading file:", error);
        return [];
    }
}

const writeToFile = (filePath, data) => {
    try {
        fs.writeFileSync('courses.json', JSON.stringify(data));
    } catch(error){
        console.log("Error writing file:", error);
    }
}

let courses = [];
try {
    courses = JSON.parse(fs.readFileSync(coursesFilePath));
} catch (error) {
    console.error('Error reading courses file:', error);
}

app.get('/courses', (req, res) => {
    res.json(courses);
});

const port = 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});

app.post('/courses', (req, res) => {
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    writeToFile(coursesFilePath, courses);
    res.json(readFromFile(coursesFilePath));
});

app.delete('/courses/:id', (req, res) => {
    const courseId = courses.find(c => c.id === parseInt(req.params.id));
    if (!courseId){
        return res.status(404).send('The course with the given ID was not found.');
    }

    const index = courses.indexOf(courseId);
    const deletedCourse = courses.splice(index, 1)[0];

    // Update IDs of remaining courses
    for (let i = index; i < courses.length; i++) {
        courses[i].id = i + 1;
    }

    fs.writeFileSync(coursesFilePath, JSON.stringify(courses));
    res.json({ deletedCourse, updatedCourses: courses });
});

app.put('/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course){
        return res.status(404).send('The course with the given ID was not found.');
    }

    course.name = req.body.name;
    fs.writeFileSync(coursesFilePath, JSON.stringify(courses));
    res.json(course);
});

const mongoose = require('mongoose');
const {all} = require("express/lib/application");
// const {RESPONSE} = require("mongodb/src/constants");
// const module: mongoose = require("mongoose");
mongoose.connect(process.env.DB_URI)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const productSchemaPath = path.join(__dirname, 'productSchema.json');
const productSchema = new mongoose.Schema(JSON.parse(fs.readFileSync(productSchemaPath)));
const productTable = mongoose.model('products', productSchema);

// to get products from db
// app.get('/products', async (req, res) => {
//     try {
//         const products = await productTable.find();
//         res.json(products);
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });

// to add a product to db
app.post('/products', async (req, res) => {
    try {
        const products = await productTable.create(req.body);
        res.status(201).json(products);
    } catch (error) {
        console.error('Error creating product(s):', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// to get products from db
app.get('/products', async (req, res) => {
    const allProducts = await productTable.find();
    res.json(allProducts);
});

// to get products by id
app.get('/products/:id', async (req, res) => {
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
});

// to update a product by id
app.put('/products/:id', async(req, res) => {
    try {
        const updatedProduct = await productTable.findByIdAndUpdate(req.params.id, req.body);
        res.json(updatedProduct);
    } catch(err){
        res.status(404).send('Product not found');
    }
});

// to delete a product by id
app.delete('/products/:id', async (req, res) => {
   try{
         const deletedProduct = await productTable.findByIdAndDelete(req.params.id);
         res.json(deletedProduct);
   } catch (err) {
         res.status(404).send('Product not found');
   }
});


