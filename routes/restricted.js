const express = require('express');
const router = express.Router();
const News = require('../models/News');

router.use((req, res, next) => {
  if ('user' in req.session) {
    if(req.session.user.roles.indexOf('restrito') >= 0){
      return next();
    }else{
      res.redirect('/');
    }
  } 
  res.redirect('/login');
});

router.get('/', (req, res) => res.send('acesso restrito!'));

router.get('/noticias', async(req, res) => {
  const noticias = await News.find({ category: 'private'});

  res.render('noticias/restrito', { noticias });
});

module.exports = router;