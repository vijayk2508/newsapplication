const Sequelize = require('sequelize');
const config = require('../env/env').mongo;
let MongoClient = require('mongodb').MongoClient;
let _db;
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// module.exports = {
// 	connectToServer: async function (callback) {
// 		await MongoClient.connect(config.url, {
// 			useNewUrlParser: true,
// 			useUnifiedTopology: true
// 		},
// 			function (err, client) {
// 				_db = client.db(config.dbname);
// 				return callback(err);
// 			});
// 	},
// 	// use this function in any routes to get the db
// 	getDb: function () {
// 		return _db;
// 	},
// connectToSql: (callback) => {
// 	const sequelize = new Sequelize('DMX', 'sa', 'root@123', {
// 		host: '122.165.140.149',
// 		port: 1433,
// 		database: 'DMX',
// 		username: 'sa',
// 		password: 'root@123',
// 		dialect: 'mssql',
// 		operatorsAliases: false,
// 		pool: {
// 			max: 5,
// 			min: 0,
// 			acquire: 30000,
// 			idle: 10000
// 		},
// 	});
// 	callback(sequelize);
// }
// };
module.exports = new Sequelize('DMX', 'sa', 'root@123', {
	host: '172.16.20.57',
	port: 1433,
	database: 'DMX',
	username: 'sa',
	password: 'root@123',
	dialect: 'mssql',
	"dialectOptions": {
		options: { "requestTimeout": 300000 }
	  },
	operatorsAliases: false,
	logging:false,
	
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
});

// require("bluebird");//

// const dbConstant = {
// 	DB_NAME: "DMX",
// 	USERNAME: "admin",
// 	PASSWORD: "root123",
// 	HOST: "172.16.20.57",
// 	PORT: "27017",
// }

// const Credential = dbConstant.USERNAME.concat(":", dbConstant.PASSWORD)
// const HOST_PORT = dbConstant.HOST.concat(":", dbConstant.PORT);

// const DB_URL = "mongodb://" + Credential + "@" + HOST_PORT + dbConstant.DB_NAME;
// console.log(DB_URL);

// mongoose.connect("mongodb://admin:root123@172.16.20.57:27017/DMX", { useNewUrlParser: true, useUnifiedTopology: true })
// 	.then((db) => {
// 		console.log("Connection successfully established");
// 	}).catch(err => {
// 		console.log('Could not connect to the database.');
// 		process.exit();
// 	});

// mongoose.pluralize(null);

// module.exports.mongoose = mongoose