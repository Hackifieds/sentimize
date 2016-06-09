var Team = require('./../models/TeamModel.js');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

exports.createTeam = function(req, res) {
  var teamObj = {
    name: req.body.name,
  };

  Team.where('name', teamObj.name).fetch().then(function(team) {
    if(!team) {
      return new Team(teamObj).save();
    }
  }).then(function(newTeam) {
    res.status(302).redirect('/login');
  })
  .catch(function(err) {
    console.log(err);
  })
};