#!/bin/env node

var passwordHelper = require('./lib/password'),
	prompt = require('prompt');


function User() {
	var userHash;
	var userSalt;
	
	this.setSalt = function(salt) {
		userSalt = salt;
	}

	this.setHash = function(hash) {
		userHash = hash;
	}

	this.getHash = function() {
		return userHash;
	}

	this.getSalt = function() {
		return userSalt;
	}
}


function validateHash(hash, callback) {
	console.log('Reinput your password to validate:');
	prompt.get([{ name: 'validatePassword' }], function (err, result) {
		if (err) { 
			return onErr(err); 
		}
		passwordHelper.validate(hash, result.validatePassword, function(valid) {
			if (!valid) validateHash(hash, callback);
			else callback();
		});
	});
}


function onErr(err) {
	console.log(err);
	return 1;
}


var user = new User();
user.setSalt(passwordHelper.generateSalt());

prompt.start();

prompt.get([{ name: 'password' }], function (err, result) {
	if (err) { return onErr(err); }

	// create hash and save in user object
	passwordHelper.hash(result.password, user.getSalt(), function(hash) {
		console.log('Hash saved in user object');
		user.setHash(hash);
		validateHash(hash, function() {

			console.log('yeah! a valid input :)');

			console.log('USER OBJECT');
			console.log('salt: ', user.getSalt());
			console.log('hash: ', user.getHash());
		});
		
	});

});