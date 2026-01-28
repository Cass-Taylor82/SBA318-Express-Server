//making a server
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

//had to add multer so that students could upload their photos
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

//Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'yearbook-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');

let students = require('./data/students.json');

//Routes
app.get('/', (req, res) => {
    res.render('2025 RTT-12 Yearbook', {stydents});
});

app.get('/profile/:id', (req, res) => {
const student = students.find(s => === parseInt(req.params.id));
    if (student) {
        res.render('profile', { student });
    } else {
        res.status(404).send('Student not found');
     }
});

app.post('/profile/:id/message', (req, res) => {
    const studentId = parseInt(req.params.id);
    const student = students.find(s => s.id === studentId);

    if (student) {
        if (!student.messages) student.messages = [];
        student.messages.push({
            author: req.body.author,
            text: req.body.message,
            date: new Date()
        });

        // Saving
        fs.writeFilesSync('./data/students.json', JSON.stringify(students, null, 2));
        res.redirect('/profile/${studentId}');
    } else {
        res.status(404).send('Student not found');
    }
});

app.listen(PORT, () => {
    console.log('Yearbook app running on http://localhost:{PORT}');
});

