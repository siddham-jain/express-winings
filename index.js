const express = require('express');
const app = express();

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


let courses = [
    {id: 1, name: "DSA"},
    {id: 2, name: "DBMS"},
    {id: 3, name: "manners"}
];

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
    res.json(course);
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
    res.json({ deletedCourse, updatedCourses: courses });
});

app.put('/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course){
        return res.status(404).send('The course with the given ID was not found.');
    }

    course.name = req.body.name;
    res.json(course);
});