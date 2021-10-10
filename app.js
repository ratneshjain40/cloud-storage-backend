const express = require('express');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
var cors = require('cors')

const routes = require('./auth/routes');
const connection = require('./db/database');

//-------------- GENERAL SETUP ----------------
require('dotenv').config();

var app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  -------------- SESSION SETUP ----------------

const sessionStore = new MongoStore({
    mongooseConnection: connection, 
    collection: 'sessions',
    autoRemove: 'interval',
    autoRemoveInterval: 10
});

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// -------------- PASSPORT AUTHENTICATION ----------------

require('./auth/passport');

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    next();
});
// -------------- ADD ROUTES ----------------

app.use(routes);
app.listen(5000);
console.log("Listening on port 5000");