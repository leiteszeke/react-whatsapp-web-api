const mysql = require('mysql');
const config = require('../database');

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
const ChatMessage = {};

/** @function
 *  @param {integer} id
 *  @param {Object} { select, callback }
 *  @return {ChatObject}
 */
ChatMessage.findByChatId = (id = 1, { select = ['chat_messages.*'], callback }) => {
	connection.query(`
		SELECT ${ select.join(', ') }, users.name, users.lastname
		FROM chat_messages
		INNER JOIN users ON users.id = chat_messages.user_id
		WHERE chat_id = ${ id };
	`, (err, res) => {
		callback(res.map(arr => {
			const user = {
				id: arr.user_id,
				name: arr.name,
				lastname: arr.lastname,
			};

			delete arr.name;
			delete arr.lastname;
			delete arr.user_id;

			return {
				...arr,
				user,
			}
		}));
	});
};

module.exports = ChatMessage;