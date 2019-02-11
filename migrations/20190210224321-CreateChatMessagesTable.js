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
  db.createTable('chat_messages', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      notNull: true,
      unsigned: true,
    },
    chat_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'chat_messages_chat_id_foreign_key',
        table: 'chats',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    user_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'chat_messages_user_id_foreign_key',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    status_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'chat_messages_status_id_foreign_key',
        table: 'message_status',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    message: {
      type: 'text',
      notNull: false,
    },
    saved: {
      type: 'boolean',
      notNull: false,
      default: false,
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
