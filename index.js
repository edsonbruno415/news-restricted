const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const port = process.env.PORT || 3000;
const mongo = process.env.MONGO || 'mongodb://localhost:27017/noticias';
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'fullstack-news'}));
app.use(express.static(path.join(__dirname,'public')));

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.get('/', (req, res) => res.render('index'));

app.listen(port, ()=> console.log('Application running on http://localhost:'+port));

