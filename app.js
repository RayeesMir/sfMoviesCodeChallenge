const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const config = require('./config');
mongoose.Promise = global.Promise;
mongoose.connect(config.getDbString("primary"))
	.then(function(con) {
		console.log("Database Connected");
	})
	.catch(function(err) {
		console.log("error connecting Database", err.message)
	})

require('./cron')();

// app.use(function(req, res, next) {
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header("Access-Control-Allow-Origin", "GET,PUT,POST,DELETE,OPTIONS");
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// 	next();
// });

const index = require('./routes/index');
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use('/', index);
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
// 	const err = new Error('Not Found');
// 	err.status = 404;
// 	next(err);
// });
module.exports = app;