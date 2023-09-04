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
const konuDB = [
    { id: 1, title: 'Konu Başlığı 1', content: 'Konu içeriği 1', author: 'Kullanıcı 1' },
    { id: 2, title: 'Konu Başlığı 2', content: 'Konu içeriği 2', author: 'Kullanıcı 2' },
    // Diğer konuları ekleyin
];

const usersDB = [
    { id: 1, name: 'admin', email: 'wozyreal@gmail.com', password: 'fc9tezhcf7', isAdmin: true, biography: ''  },
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
    const { name, email, password, biography } = req.body;
    const newUser = { id: usersDB.length + 1, name, email, password, isAdmin: false, biography:"" };
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

app.post('/edit-bio', (req, res) => {
    if (req.session.user) {
        const userId = req.session.user.id;
        const newBiography = req.body.biography;

        const user = usersDB.find(u => u.id === userId);
        if (user) {
            user.biography = newBiography;
            req.session.user.biography = newBiography;
            res.redirect('/profile');
        } else {
            res.status(404).send('Kullanıcı bulunamadı.');
        }
    } else {
        res.redirect('/login');
    }
});

app.post('/create', (req, res) => {
    const { title, content } = req.body;
    const author = req.session.user.name; // Oturum açmış kullanıcının adı

    // Yeni konu verisini oluşturun
    const newTopic = {
        title,
        content,
        author,
        date: new Date() // Konu oluşturulma tarihi
    };

    // Yeni konu verisini konuDB dizisine ekleyin
    konuDB.push(newTopic);

    res.redirect('/');
});

// app.js

// ... (diğer kodlar)

app.get('/create', (req, res) => {
    if (req.session.user) {
        res.render('create', { user: req.session.user });
    } else {
        res.redirect('/login'); // Kullanıcı oturumu açmamışsa login sayfasına yönlendir
    }
});

app.listen(port, () => {
    console.log(`[SpeedyCoderz] Sunucu ${port} portunda çalışıyor.`);
});
