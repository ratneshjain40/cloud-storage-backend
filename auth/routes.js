const router = require('express').Router();
const passport = require('passport');
const genPassword = require('./passwordUtils').genPassword;
const connection = require('../db/database');
const isAuth = require("./verifyAuth").isAuth;
const User = connection.models.User;


//-------------- POST ROUTES ----------------

router.post('/login', passport.authenticate("local", { failureRedirect: '/login-failure', successRedirect: '/login-success' }));
router.post('/register', (req, res, next) => {
    const passwordObj = genPassword(req.body.password);
    const newUser = new User({
        username: req.body.username,
        hash: passwordObj.hash,
        salt: passwordObj.salt
    });

    newUser.save().
        then((user) => {
            console.log(`user created ${user}`);
        });

    res.redirect('/login');
});

//-------------- GET ROUTES ----------------

router.get('/', (req, res, next) => {
    res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get('/login', (req, res, next) => {

    const form = '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);

});

router.get('/register', (req, res, next) => {

    const form = '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);

});

router.get('/protected-route', isAuth, (req, res, next) => {
    res.send('<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>');
});

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/protected-route');
});

router.get('/login-success', (req, res, next) => {
    res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

module.exports = router;