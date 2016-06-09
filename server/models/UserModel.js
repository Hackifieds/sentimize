var db = require('../config/db');
var Snapshot = require('./SnapshotModel.js');
var Session = require('./SessionModel.js');
var Promise = require('bluebird');
var Team = require('./TeamModel.js')

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.string('email', 255).unique();
      user.string('username', 255);
      user.string('gender', 1);
      user.integer('age');
      user.string('ethnicity', 255);
      user.string('firstName', 255);
      user.string('lastName', 255);
      user.string('teamid', 255)
      user.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  snapshots: function() {
    return this.hasMany(Snapshot);
  },
  sessions: function() {
    return this.hasMany(Session);
  },

 team: function() {
    return this.belongTo(Team, 'teamid');
  }

});

module.exports = User;