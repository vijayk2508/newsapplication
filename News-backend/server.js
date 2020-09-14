const express = require('express');
const app = require('./app');
const http = require('http');
const logoFunc = require("./utils/verbose");
const config = require('./env/env');
const auth = require('./routes/auth');
const taxonomy = require('./routes/taxonomy');
const project = require('./routes/project');
const mongoose = require("mongoose");
const path = require("path");
const vocabulary = require('./routes/vocabulary');
const textmining = require('./routes/textmining');
const profile = require('./routes/profile');
const news = require('./routes/news');
try {
	console.log(`${__dirname}\\bin\\wwwroot\\`, "hahahah")

	const server = http.createServer();
	server.listen(config.port, config.ip, () => {
		console.log(server.address().address, server.address().port);
		logoFunc.printlogo();
	});
	
	server.on('request', app);


	mongoose.connect(config.mongo.url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: true
	}, err => {
		if (!err) {
			app.get('/', (req, res) => {
				res.sendFile(path.join(`${__dirname}/index.html`));
			});
			console.log("Connection successfully established");
			app.use('/static', express.static("bin"));
			app.use('/auth/', auth);
			//app.use(jwtValidator.validateToken);
			app.use('/project/', project);
			app.use('/taxonomy/', taxonomy);
			app.use('/textmining/', textmining);
			app.use('/vocabulary/', vocabulary);
			app.use('/profile/', profile);
			app.use('/news/', news);
		}
		else throw err
	});
} catch (error) {
	console.log(error)
}

// mongoUtil.connectToServer((err) => {
// 	if (err) console.log(err);
// 	app.get('/', (req, res) => {
// 		res.send('<html><title>Node-mongo-boilerplate</title><body><h4>Service is running...</h4></body></html>');
// 	});
// 	app.use('/auth/', auth);
// 	app.use('/taxonomy/', taxonomy);
// });