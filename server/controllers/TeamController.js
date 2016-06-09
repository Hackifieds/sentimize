var Team = require('./../models/TeamModel.js');
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

exports.getCurrentTeam = function(req, res) {
  User.where({ id: req.team.id }).fetch()
    .then(function(currentTeam) {
      // Null out password before sending information
      currentTeam.password = null;
      res.status(200).send(currentUser);
    })
    .catch(function(err) {
      console.error(err);
    })
};
