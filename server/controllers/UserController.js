var User = require('./../models/UserModel.js');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

exports.createUser = function(req, res) {
  var userObj = {
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    email: req.body.email,
    username: req.body.username
  };

  User.where('email', userObj.email).fetch().then(function(user) {
    if(!user) {
      return new User(userObj).save();
    }
  }).then(function(newUser) {
    res.status(302).redirect('/login');
  })
  .catch(function(err) {
    console.log(err);
  })
};

exports.getCurrentUser = function(req, res) {
  User.where({ id: req.user.id }).fetch()
    .then(function(currentUser) {
      // Null out password before sending information
      currentUser.password = null;
      res.status(200).send(currentUser);
    })
    .catch(function(err) {
      console.error(err);
    })
};




