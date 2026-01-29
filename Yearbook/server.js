//making a server
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

//had to add multer so that students could upload their photos
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bycrpt');

// Creating express instance
const app = express();
const PORT =  process.env.PORT || 3000;

//Getting Multer set up
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/upload/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() *1E9);
        cb(null, uniqueSuffix + path.extreme(file.originalname));
    }
});

// So that code will only take image files
const fileFilter = (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'yearbook-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}));

//making ejs a template engine for html
app.set('view engine', 'ejs');

// since I don't have a data directory of students
if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
}

let studentsDataPath = './data/students.json';
let students = [];

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

