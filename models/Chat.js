const mysql = require('mysql');
const config = require('../database');
const ChatMessage = require('./ChatMessage');

const connection = mysql.createConnection({
	host: config.dev.host,
	user: config.dev.user,
	password: config.dev.password,
	database: config.dev.database,
	port: config.dev.port,
});

connection.connect();

/** @constant
 * 	@type {Object}
 *  @default
 */
const Chat = {};

/** @function
 *  @param {object} { select, order, callback }
 *  @return {Array<ChatObject>}
 */
Chat.all = ({ select = ['chats.*'], order = ['chats.updated_at DESC, chats.created_at DESC'], callback }) => {
	connection.query(`
		SELECT ${ select.join(', ') }, users.name, users.lastname
		FROM chats
		INNER JOIN users ON users.id = chats.user_id
		ORDER BY ${ order.join(', ') }
		LIMIT 20;
	`, (err, res, fields) => {
		callback(res);
	});
};

/** @function
 *  @param {integer} id
 *  @param {Object} { select, callback }
 *  @return {ChatObject}
 */
Chat.findById = (id = 1, { select = ['chats.*'], includes = [], callback }) => {
	connection.query(`
		SELECT
			${ select.join(', ') },
			user.id AS user_id,
			user.name AS user_name,
			user.lastname AS user_lastname,
			receiver.id AS receiver_id,
			receiver.name AS receiver_name,
			receiver.lastname AS receiver_lastname
		FROM chats
		INNER JOIN users AS user ON chats.user_id = user.id
		INNER JOIN users AS receiver ON chats.receiver_id = receiver.id
		WHERE chats.id = ${ id };
	`, (err, res) => {
		const result = res[0];

		result.receiver = {
			id: result.receiver_id,
			lastname: result.receiver_lastname,
			name: result.receiver_name,
		};

		result.user = {
			id: result.user_id,
			lastname: result.user_lastname,
			name: result.user_name,
		};

		delete result.receiver_id;
		delete result.receiver_name;
		delete result.receiver_lastname;
		delete result.user_id;
		delete result.user_name;
		delete result.user_lastname;

		if (includes.length > 0) {
			const relations = new Promise((resolve, reject) => {
				includes.forEach((include, index, array) => {
					Chat.relations[include](result.id, (response) => {
						result[include] = response;
						if (index === array.length - 1) {
							resolve();
						}
					});
				});
			});

			relations.then(() => {
				callback(result);
			})
		} else {
			callback(result);
		}
	});
};

Chat.relations = {};

Chat.relations.messages = async (id, callback) => {
	ChatMessage.findByChatId(id, { callback: (response) => {
		callback(response);
	}});
}

module.exports = Chat;