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

    }
})
app.listen(PORT, () => {
    console.log('Server in running on http://localhost:{PORT}');
});

// connecting to the database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Yearbook_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB...', err));