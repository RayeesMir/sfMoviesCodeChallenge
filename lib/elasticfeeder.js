const movieModel = require('../models/movies')
const elasticInterface = require('./elastic');
const config = require('../config');
const _ = require('lodash');

const client = new elasticInterface(config.elasticSearch.host, config.elasticSearch.port);
const esClient = client.esClient;

function DataFeeder() {
    /**
	 * This Method Just Removes _id key from data
	 * so that there will be no error in loading data in elastic search
     * @param data
     * @returns {Promise}
     */
	this.changeIds = function(data) {
		let result = [];
		return new Promise(function(resolve, reject) {
			_.each(data, function(item, index) {
				let docid = item._id;
				delete item._id;
				item["movieId"] = docid;
				result.push(item)
			});
			resolve(result);
		})
	};

    /**
	 * Fetch Data from MongoDB
     * @returns {Promise}
     */

	this.getDataFromMongoDB = function() {
		return movieModel
			.find({})
			.select("-__v")
			.lean()
			.exec();
	};

    /**
	 * Delete Index if it is already there and create new index with new data
     * @param name
     * @param type
     * @param result
     * @returns {Promise}
     */

	this.deleteAndCreate = function(name, type, result) {
		return new Promise(function(resolve, reject) {
			client.deleteIndex(name)
				.then(function(result) {
					console.log("inside delete", result);
					if (result.acknowledged) {
						return client.bulkDataHandler(name, type, result);
					}
				})
				.then(function(result) {
					resolve(result)
				})
				.catch(function(error) {
					reject(error)
				})
		})
	}
}

DataFeeder.prototype = {

    /**
	 * interface to module to load data In Elastic Search
     * @param done
     */
	feed: function(done) {
		let data;
		let self = this;
		this.getDataFromMongoDB()
			.then(function(result) {
				return self.changeIds(result);
			})
			.then(function(result) {
				data = result;
				return client.indexExists('sfmovies');
			})
			.then(function(result) {
				console.log(result)
				if (result) {
					console.log("if")
					return self.deleteAndCreate('sfmovies', 'movies', data);
				} else {
					console.log("else")
					return client.bulkDataHandler('sfmovies', 'movies', data);
				}
			})
			.then(function(result) {
				console.log("data Received", result);
				return client.bulkInserts(result);
			})
			.then(function(result) {
				let errorCount = 0;
				result.items.forEach(item => {
					if (item.index && item.index.error) {
						console.log(++errorCount, item.index);
					}
				});
				console.log(`Successfully indexed ${data.length - errorCount} out of ${data.length} items`);
				done();
			})
			.catch(function(error) {
				console.log(error)
			})

	},
    /**
	 * Interface to search movies in elastic search
     * @param searchTerm
     * @param index
     * @returns {Promise}
     */
	searchMovies: function(searchTerm, index) {
		return new Promise(function(resolve, reject) {
			let body = {
				size: 11,
				from: 0,
				query: {
					match: {
						title: {
							query: searchTerm
						}
					}
				}
			};
			let foundResults = [];
			client.search(index, body)
				.then(results => {
					console.log(`found ${results.hits.total} items in ${results.took}ms`);
					results.hits.hits.forEach(function(hit, index) {
						foundResults.push(hit._source);
					})
					resolve(foundResults)
				})
				.catch(function(error) {
					console.log(error)
					reject()
				});
		})
	}
};

module.exports = DataFeeder;