const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose'); // Mongoose'ü içe aktarın
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

mongoose.connect('mongodb://localhost:27017/proje_adiniz', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB bağlantısı başarılı.');
}).catch((err) => {
    console.error('MongoDB bağlantı hatası:', err);
});

const KonuSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    date: { type: Date, default: Date.now },
});

const Konu = mongoose.model('Konu', KonuSchema);

// Diğer kodlar burada

app.get('/create', (req, res) => {
    if (req.session.user) {
        res.render('create', { user: req.session.user });
    } else {
        res.redirect('/login');
    }
});

app.post('/create', async (req, res) => {
    if (req.session.user) {
        const { title, content } = req.body;
        const author = req.session.user.name;

        const newTopic = new Konu({
            title,
            content,
            author,
        });

        try {
            await newTopic.save();
            res.redirect('/');
        } catch (err) {
            console.error('Konu kaydedilirken hata oluştu:', err);
            res.status(500).send('Konu oluşturma hatası');
        }
    } else {
        res.redirect('/login');
    }
});

app.get('/', async (req, res) => {
    try {
        const konular = await Konu.find().sort({ date: 'desc' });
        res.render('index', { user: req.session.user, konular });
    } catch (err) {
        console.error('Konuları getirirken hata oluştu:', err);
        res.status(500).send('Konuları getirme hatası');
    }
});

// Diğer kodlar burada

app.listen(port, () => {
    console.log(`[SpeedyCoderz] Sunucu ${port} portunda çalışıyor.`);
});
