const express = require('express');
const app = express();

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
