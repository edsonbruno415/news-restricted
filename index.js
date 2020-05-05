const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const port = process.env.PORT || 3000;
const mongo = process.env.MONGODB || 'mongodb://localhost:27017/noticias';
const app = express();

const news = require('./routes/news');
const restricted = require('./routes/restricted');

const User = require('./models/User');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));
app.use(session({ secret: 'fullstack-news' }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/restrito', (req, res, next) => {
    if ('user' in req.session) {
        return next();
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => res.render('login'));
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user != null) {
            const isValid = await user.checkPassword(req.body.password);
            if (isValid) {
                req.session.user = user;
                res.redirect('/restrito/noticias');
            } else {
                throw new Error('Invalid Password !');
            }
        } else {
            throw new Error('User not found !');
        }
    }
    catch (err) {
        console.log('Error:', err);
        res.redirect('/login');
    }
});
app.get('/', (req, res) => res.render('index'));
app.use('/noticias', news);
app.use('/restrito', restricted);

const createInitialUser = async () => {
    const totalUsers = await User.countDocuments({ username: 'admin' });

    if (totalUsers === 0) {
        const user = new User({
            username: 'admin',
            password: '123'
        });

        user.save(() => console.log('initial user created!'));
    } else {
        console.log('user created skipped!');
    }
}

mongoose.connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        createInitialUser();
        app.listen(port, () => console.log('Application running on http://localhost:' + port));
    })
    .catch((error) => {
        console.error(error);
    });