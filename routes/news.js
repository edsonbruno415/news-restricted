const express = require('express');
const router = express.Router();
const News = require('../models/News');

router.get('/', async(req, res)=> {
  /*
  let conditions = {};
  if('user' in req.session){

  }else{

  }
  */
    const noticias = await News.find({ category: 'public' });
  res.render('noticias/index', { noticias });
});

module.exports = router;