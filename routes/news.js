const express = require('express');
const router = express.Router();

router.get('/', (req, res)=> res.send('noticias publicas'));

module.exports = router;