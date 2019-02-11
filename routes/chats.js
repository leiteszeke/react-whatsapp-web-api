// Dependencies
const express = require('express');
const passport = require('passport');
// Router
const router = express.Router();
// Models
const Chat = require('../models/Chat');

// Chats Routes
router.get('/chats', passport.authenticate('jwt', { session: false }), (req, res) => {
	Chat.all({ callback: (response) =>
		res.send({ error: false, message: 'chats_fetched', data: response })
	});
});

router.get('/chats/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { id } = req.params;
	Chat.findById(id, { includes: ['messages'], callback: (response) =>
		res.send({ error: false, message: 'chat_fetched', data: response })
	});
});

module.exports = router;