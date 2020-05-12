const express = require('express');
const router = express.Router();
const News = require('../models/News');

router.use((req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user.roles.indexOf('admin') >= 0) {
            return next();
        } else {
            res.redirect('/');
        }
    }
    res.redirect('/login');
});

router.get('/', (req, res) => res.send('acesso restrito!'));

router.get('/noticias', async (req, res) => {
    const noticias = await News.find({});

    res.render('noticias/admin', { noticias });
});

module.exports = router;