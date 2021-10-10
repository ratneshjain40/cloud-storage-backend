const router = require('express').Router();
const passport = require('passport');
const genPassword = require('./passwordUtils').genPassword;
const connection = require('../db/database');
const isAuth = require("./verifyAuth").isAuth;
const User = connection.models.User;

//-------------- POST ROUTES ----------------

router.post('/login', passport.authenticate("local", { failureRedirect: '/login-failure', successRedirect: '/login-success' }));

router.post('/logout', (req, res, next) => {
    req.logout();
    res.json({
        "success":true
    });
});

router.post('/register', (req, res, next) => {
    const passwordObj = genPassword(req.body.password);
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        hash: passwordObj.hash,
        salt: passwordObj.salt
    });

    newUser.save().
        then((user) => {
            console.log(`user created ${user}`);
            res.json({
                "success":true
            });
        }).catch(err => {
            res.json({
                "success":false
            });
        });
});

//-------------- GET ROUTES ----------------

router.get('/protected-route', isAuth, (req, res, next) => {
    res.json({
        "success":true,
        "msg":"authenticated"
    });
});

router.get('/is-logged', isAuth, (req, res, next) => {
    res.json({
        "user":req.user.username,
        "email":req.user.email,
        "success":true,
    });
});

router.get('/login-success', (req, res, next) => {
    res.json({
        "user":req.user.username,
        "email":req.user.email,
        "success":true,
    });
});

router.get('/login-failure', (req, res, next) => {
    res.json({
        "success":false,
    });
});

module.exports = router;