const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;
const mongo = 'mongodb://localhost:27017/noticias' || process.env.MONGO;
const app = express();

const news = require('./routes/news');
const restricted = require('./routes/restricted');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'fullstack-news' }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => res.render('index'));
app.use('/noticias', news);
app.use('/restrito', restricted);

mongoose.connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(port, () => console.log('Application running on http://localhost:' + port));
    })
    .catch((error) => {
        console.error(error);
    });