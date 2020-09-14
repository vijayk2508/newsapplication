const ex = {};
const authData = require('../data/auth-data');
const jwtValidatior = require('../auth/jwtValidation');
const passwordValidator = require('../utils/auth');
ex.login = async (username, password) => {
	return new Promise(async (resolve, reject) => {
		// do your buisness login here
		authData.login(username, password).then(result => {
			let isValid = passwordValidator.comparePassword(password, result['password']);
			if (isValid) {
				let token = jwtValidatior.generateToken(result);
				console.log(token)
				return resolve(token);
			}
		}, err => {
			return reject(err);
		});
	});
};

module.exports = ex;