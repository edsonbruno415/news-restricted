const express = require('express');
const router = express.Router();
const User = require('../models/User');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

//definindo estrategia para login local
passport.use(new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({ username });

    if (user) {
        const isValid = await user.checkPassword(password);
        if (isValid) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } else {
        return done(null, false);
    }
}));

//facebook
passport.use(new FacebookStrategy({
    clientID: '238195520783068',
    clientSecret: 'bdd8f661dcc5f32784812ed2b2a2d840',
    callbackURL: 'http://localhost:3000/facebook/callback',
    profileFields: ['id', 'displayName', 'email', 'photos']
}, async (acessToken, refreshToken, profile, done) => {
    const userDB = await User.findOne({ facebookId: profile.id });
    if (!userDB) {
        const user = new User({
            name: profile.displayName,
            facebookId: profile.id,
            roles: ['restrito']
        });
        await user.save(() => console.log('Save user from facebook!'));
        done(null, user);
    } else {
        done(null, userDB);
    }
}));

router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/',
    successRedirect: '/'
}));

//Google
passport.use(new GoogleStrategy({
    clientID: '360249003082-g4jq41ebi3c0knu12nojtl4qaej9iukm.apps.googleusercontent.com',
    clientSecret: 'lfceGS7flhdJySYF6EjZogmI',
    callbackURL: 'http://localhost:3000/google/callback'
}, async (acessToken, refreshToken, err, profile, done) => {
    const userDB = await User.findOne({ googleId: profile.id });
    if (!userDB) {
        const user = new User({
            name: profile.displayName,
            googleId: profile.id,
            roles: ['restrito']
        });
        await user.save(() => console.log('Save user from Google!'));
        done(null, user);
    } else {
        done(null, userDB);
    }
}));

router.get('/google', passport.authenticate('google',{ scope: ['https://www.googleapis.com/auth/userinfo.profile']}));
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/',
    successRedirect: '/'
}));


router.use((req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
        if (!req.session.role) {
            req.session.role = req.user.roles[0];
        }
        res.locals.role = req.session.role;
    }
    next();
});

router.get('/change-role/:role', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.roles.indexOf(req.params.role) >= 0) {
            req.session.role = req.params.role;
        }
    }
    res.redirect('/');
});

router.get('/login', (req, res) => res.render('login'));

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false
}));

module.exports = router;
