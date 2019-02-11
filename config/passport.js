// Dependencies
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
// Models
const User = require('../models/User');

/** @function
 *  @param {Object} user
 *  @param {function} done
 */
passport.serializeUser((user, done) => {
	done(null, user.id);
});

/** @function
 *  @param {integer} id
 *  @param {function} done
 */
passport.deserializeUser((id, done) => {
	User.findById(id, { callback: (res) => {
		done(null, res);
	}});
});

/** @function
 *  @param {Strategy}
 *  @param {function}
 */
passport.use(new LocalStrategy(
	{
		usernameField: 'email',
		passReqToCallback: true,
	},
	(req, email, password, done) => {
		User.findByEmail(email, { callback: (res) => {
			if (typeof res === 'undefined') {
				return done(null, { 'errors': 'user not found' });
			}

			if (res.password === password) {
				return done(null, res);
			}

			return done(null, { 'errors': 'incorrect password' });
		}});
	}
));

/** @function
 *  @param {Strategy}
 *  @param {function}
 */
passport.use(new JWTStrategy({
	jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
	secretOrKey   : 'your_jwt_secret'
}, (jwtPayload, done) => {
	User.findById(jwtPayload.id, { callback: (res) => {
		if (typeof res === 'undefined') {
			return done(null, false);
		}

		return done(null, res);
	}});

}));

module.exports = passport;