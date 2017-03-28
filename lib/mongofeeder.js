const MovieLoader = require('./index')
const config = require('../config');
const dataSource = config.baseUrl + config.endPoints.movies;
const ElasticDataFeeder = require('./elasticfeeder');
const feeder = new ElasticDataFeeder();

module.exports = {
    /**
	 * Load data in MongoDB
     * @param done
     */
	feed: function(done) {
		MovieLoader
			.fetchAndstoreMovies(dataSource)
			.then(function(result) {
				if (result) {
					console.log("loaded and stored")
					feeder.feed(done);
				}
				console.log(result)
			})
			.catch(function(error) {
				console.log(error)
			})
	}
}