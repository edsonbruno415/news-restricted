const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.send('acesso restrito!'));

router.get('/noticias', (req, res) => res.send('noticias privadas'));

module.exports = router;