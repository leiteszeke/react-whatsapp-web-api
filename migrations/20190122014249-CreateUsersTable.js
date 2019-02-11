'use strict';

var dbm;
var type;
var seed;

const moment = require('moment');

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.createTable('users', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      notNull: true,
      unsigned: true,
    },
    name: {
      type: 'string',
      length: 40,
      notNull: true,
    },
    lastname: {
      type: 'string',
      length: 40,
      notNull: true,
    },
    email: {
      type: 'string',
      length: 100,
      notNull: true,
    },
    password: {
      type: 'string',
      length: 200,
      notNull: true,
    },
    created_at: {
      type: 'datetime',
      notNull: true,
      defaultValue: 'CURRENT_TIMESTAMP',
    },
    updated_at: {
      type: 'datetime',
    },
    deleted_at: {
      type: 'datetime',
    },
  }, function(err) {
    if (err) return callback(err);
    return callback();
  });
};

exports.down = function(db, callback) {
  db.dropTable('users', callback);
};

exports._meta = {
  "version": 1
};
