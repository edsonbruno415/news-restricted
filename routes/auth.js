const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/login', (req, res) => res.render('login'));

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user != null) {
            const isValid = await user.checkPassword(req.body.password);
            if (isValid) {
                req.session.user = user;
                res.redirect('/restrito/noticias');
            } else {
                throw new Error('Invalid Password !');
            }
        } else {
            throw new Error('User not found !');
        }
    }
    catch (err) {
        console.log('Error:', err);
        res.redirect('/login');
    }
});

module.exports = router;
