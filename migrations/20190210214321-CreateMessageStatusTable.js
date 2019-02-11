'use strict';

var dbm;
var type;
var seed;

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
  db.createTable('message_status', {
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
    created_at: {
      type: 'datetime',
      notNull: true,
      defaultValue: new String('now()'),
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
  db.dropTable('posts', callback);
};

exports._meta = {
  "version": 1
};
