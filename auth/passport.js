const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('../db/database');
const User = connection.models.User;
const validPassword = require('./passwordUtils').validPassword;

const customFields = {
	usernameField: 'username',
	passwordField: 'password',
};

const verifyCallback = (username, password, done) => {
	User.findOne({ username: username })
		.then((user) => {
			console.log('inside db User ' + user);
			if (!user) {
				return done(null, false);
			}

			const isValid = validPassword(password, user.hash, user.salt);

			if (isValid) {
				return done(null, user);
			} else {
				return done(null, false);
			}
		})
		.catch((err) => {
			done(err);
		});
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
	// user._id is same as user.id
	done(null, user.id);
});

passport.deserializeUser((userId, done) => {
	User.findById(userId)
		.then((user) => {
			console.log('Found User ', user);
			done(null, user);
		})
		.catch((err) => {
			done(err);
		});
});
