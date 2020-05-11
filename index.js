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

const User = require('./models/User');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));
app.use(session({ secret: 'fullstack-news' }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req,res,next)=>{
    if('user' in req.session){
       res.locals.user = req.session.user; 
    }
    next();
});
app.use('/restrito', (req, res, next) => {
    if ('user' in req.session) {
        return next();
    } else {
        res.redirect('/login');
    }
});

app.use('/noticias', news);
app.use('/restrito', restricted);
app.use('/',auth);
app.use('/', pages);

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