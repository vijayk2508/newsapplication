let DB_NAME = "NEWS";
let PORT = "27017";
let HOST = "localhost";
let HOST_PORT = HOST.concat(":", PORT);
let DB_URL = "mongodb://" + HOST_PORT + "/" + DB_NAME;


module.exports = {
	mongo:{
		url: 'mongodb://localhost:27017/NEWS',
		dbname: DB_NAME,
	},
	sql:{
		server:"172.16.20.57",
		user:"sa",
		password:"root@123",
		port:1433,
		database:"DMX",
	},
	//ip: '172.16.20.97',
	ip: 'localhost',
	port: 3005 || process.argv[2]
};
