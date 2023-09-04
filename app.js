// app.js

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'mysecretkey',
    resave: true,
    saveUninitialized: false
}));

const usersDB = [
    { id: 1, name: 'admin', email: 'wozyreal@gmail.com', password: 'fc9tezhcf7', isAdmin: true },
];

app.get('/', (req, res) => {
    res.render('index', { user: req.session.user });
});

app.get('/login', (req, res) => {
    res.render('login', { user: req.session.user });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = usersDB.find(u => u.email === email && u.password === password);
    
    if (user) {
        req.session.user = user;
        res.redirect('/profile');
    } else {
        res.redirect('/login');
    }
});

app.get('/register', (req, res) => {
    res.render('register', { user: req.session.user });
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const newUser = { id: usersDB.length + 1, name, email, password, isAdmin: false };
    usersDB.push(newUser);
    res.redirect('/login');
});

app.get('/profile', (req, res) => {
    if (req.session.user) {
        res.render('profile', { user: req.session.user });
    } else {
        res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

app.get('/admin', (req, res) => {
    if (req.session.user && req.session.user.isAdmin) {
        res.render('admin', { user: req.session.user });
    } else {
        res.redirect('/login');
    }
});

app.post('/admin/adduser', (req, res) => {
    if (req.session.user && req.session.user.isAdmin) {
        const { name, email, password } = req.body;
        const newUser = { id: usersDB.length + 1, name, email, password, isAdmin: false };
        usersDB.push(newUser);
        res.redirect('/admin');
    } else {
        res.redirect('/login');
    }
});

app.listen(port, () => {
    console.log(`[SpeedyCoderz] Sunucu ${port} portunda çalışıyor.`);
});
