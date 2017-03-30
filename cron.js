const config = require('./config');
const mongofeeder = require('./lib/mongofeeder');
const Agenda = require('agenda');
module.exports = function Cron() {
	var agenda = new Agenda({
		db: {
			address: config.getDbString("secondary")
		}
	});

	(function initCron() {
		agenda.define('load movies in database', function(job, done) {
			console.log("load movies in");
			mongofeeder.feed(done);
		});

		agenda.on('ready', function() {
			console.log("load movies in");
			agenda.every('30 days', 'load movies in database');
			agenda.start();
		});
	})();
}
