const express = require('express');
const router = express.Router();
const News = require('../models/News');

router.use((req, res, next) => {
  if ('user' in req.session) {
      return next();
  } else {
      res.redirect('/login');
  }
});

router.get('/', (req, res) => res.send('acesso restrito!'));

router.get('/noticias', async(req, res) => {
  const noticias = await News.find({ category: 'private'});

  res.render('noticias/restrito', { noticias });
});

module.exports = router;