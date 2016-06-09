var db = require('../config/db');
var Snapshot = require('./SnapshotModel.js');
var Session = require('./SessionModel.js');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var User = require("./UserModel.js")

db.knex.schema.hasTable('team').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('team', function (team) {
     team.increments('id').primary();
     team.string('name', 255).unique();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});


var Team = db.Model.extend({
  tableName: 'team',
  users: function(){
  	return this.hasMany(User)
  }


  module.exports = Team;