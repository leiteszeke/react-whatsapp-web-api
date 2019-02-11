// Dependencies
const express = require('express');
const uuid = require('uuid/v4');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
const cors = require('cors');

// App Configuration
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(session({
	genid: () => uuid(),
	store: new FileStore(),
	secret: 'whatsapp',
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');
app.use(require('./routes/public'));
app.use(require('./routes/chats'));

// App Server
app.listen(8003);