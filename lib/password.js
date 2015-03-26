var crypto = require('crypto');

function generateSalt() {
	return crypto.randomBytes(128).toString('base64');
}

function createHash(password, salt, callback) {
	crypto.pbkdf2(password, salt, 10000, 512, function(err, key) { 
		if (callback) callback(salt + key);
	});
}

function validateHash(hash, password, callback) {
	var salt = hash.substr(0, 172);
	createHash(password, salt, function(validHash) {
		callback(hash === validHash);
	});
}

module.exports = {
	'hash': createHash,
	'validate': validateHash,
	'generateSalt': generateSalt
};