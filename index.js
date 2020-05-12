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
const auth = require('./routes/auth');
const pages = require('./routes/pages');
const admin = require('./routes/admin');

const User = require('./models/User');
const News = require('./models/News');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));
app.use(session({ secret: 'fullstack-news' }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', auth);
app.use('/', pages);
app.use('/noticias', news);
app.use('/restrito', restricted);
app.use('/admin', admin);

const createInitialUser = async () => {
    const totalUsers = await User.countDocuments({});

    if (totalUsers === 0) {
        const user1 = new User({
            username: 'user1',
            password: '123',
            roles: ['restrito', 'admin']
        });

        await user1.save(() => console.log('initial user created!'));

        const user2 = new User({
            username: 'user2',
            password: '123',
            roles: ['restrito']
        });

        await user2.save(() => console.log('initial user created!'));
    } else {
        console.log('user created skipped!');
    }
    /*
    const newsPublic = new News({
        title: 'Noticia Publica ' + new Date().getTime(),
        content: 'Conteudo noticia public',
        category: 'public'
    });

    await newsPublic.save(()=> console.log('salvo noticia publica'));

    const newsPrivate = new News({
        title: 'Noticia Privada ' + new Date().getTime(),
        content: 'Conteudo noticia private',
        category: 'private'
    });

    await newsPrivate.save(()=> console.log('salvo noticia Privadas'));
    */
}

mongoose.connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        createInitialUser();
        app.listen(port, () => console.log('Application running on http://localhost:' + port));
    })
    .catch((error) => {
        console.error(error);
    });