module.exports = {
	mongo:{
		url: 'mongodb://admin:root123@172.16.20.57:27017/DMX',
		dbname: 'DMX',
	},
	sql:{
		server:"172.16.20.57",
		user:"sa",
		password:"root@123",
		port:"22",
		database:"DMX",
	},
	//ip: '172.16.20.97',
	ip: 'localhost',
	port: 3001 || process.argv[2]
};
