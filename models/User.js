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
const User = {};

/** @function
 *  @param {string} email
 *  @return {UserObject}
 */
User.findByEmail = (email = '', { select = ['*'], callback }) => {
	connection.query(`SELECT ${ select.join(', ') } FROM users WHERE email = '${ email }';`, (err, res, fields) => {
		callback(res[0]);
	});
};

/** @function
 *  @param {integer} id
 *  @param {Object} { select, callback }
 *  @return {UserObject}
 */
User.findById = (id = 1, { select = ['*'], callback }) => {
	connection.query(`SELECT ${ select.join(', ') } FROM users WHERE id = ${ id };`, (err, res) => {
		callback(res[0]);
	});
};

module.exports = User;