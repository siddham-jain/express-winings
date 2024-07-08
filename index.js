const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json()); // middleware for parsing json objects

const morgan = require('morgan');
app.use(morgan('combined')); // middleware for logging activities

const logger = (req, res, next) => {
    const hostname = req.hostname;
    const date = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    console.log(`[${date}] ${hostname} ${method} ${url}`);
    next();
};

app.use(logger); // middleware for logging activities

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});

const productRoutes = require('./routes/productRouter');
app.use('/products', productRoutes);