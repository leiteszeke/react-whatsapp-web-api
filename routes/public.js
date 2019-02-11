// Dependencies
const express = require('express');
const passport = require('passport');
const url = require('url');
const jwt = require('jsonwebtoken');
// Router
const router = express.Router();
// Models

// Login Routes
router.post('/login', (req, res, next) => {
	passport.authenticate('local', (err, user) => {
		req.login(user, () => {
			if (typeof user === 'undefined') {
				return res.status(500).send({ error: true, message: "server_error" });
			}

			if (typeof user.errors !== 'undefined') {
				return res.status(401).send({ error: true, message: user.errors });
			}

			if (user === false) {
				return res.status(401).
				send({
					error: true,
					message: 'user_not_found',
					data: {},
				});
			}

			const token = jwt.sign(user.id, 'your_jwt_secret');

			return res.send({
				error: false,
				message: 'logged_succesfully',
				data: {
					id: user.id,
					email: user.email,
					name: user.name,
					lastname: user.lastname,
					token
				}
			});
		});
	})(req, res, next);
});

module.exports = router;