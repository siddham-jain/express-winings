const express = require('express');
const fs = require('fs');

const app = express();
const path = require('path');


app.use(express.json());
const morgan = require('morgan');
app.use(morgan('combined'));

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