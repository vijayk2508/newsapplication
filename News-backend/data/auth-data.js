const userModel = require("../models/User");
const validatePassword = require("../utils/auth");
const ex = {};
ex.login = async (username, password) => {
	return new Promise(async (resolve, reject) => {
		userModel.validateUser.findOne({
			where: {
				orguserEmail: username
			},
			attributes: ['orguserEmail', 'orgUserId', 'orgUserName', 'password'],
			order: ['orgUserId']
		}).then(users => {
			let userDetails = JSON.parse(JSON.stringify(users, null, 4))
			return resolve(userDetails);
		}, err => { return resolve(err) })
	}).catch(err => console.log(err));
};

module.exports = ex;
