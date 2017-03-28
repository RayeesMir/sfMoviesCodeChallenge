const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
	title: {
		type: String,
		index: 1
	},
	// actors: [ObjectId],
	releaseYear: {
		type: String
	},
	director: {
		type: String,
		index: 1
	},
	image: {
		type: String
	},
	writer: {
		type: String
	},
	productionCompany: {
		type: String
	},
	distributor: {
		type: String
	}

});

/**
 * Searches Movie Based on Movie Title
 * @param title -- is the Title Of the movie as a string type
 * @returns {Promise}
 */
MovieSchema.statics.findMovie = function(title) {
	return this.findOne({
		title: title
	}).exec();
};

/**
 * Search Movies Based On Search Term
 * @param term -- is SearchTerm Regex
 * @param limit -- is total number of results to be fetched and returned
 * @returns {Promise}
 */
MovieSchema.statics.getMovies = function(term,limit) {
	return this.find({
			title: term
		})
		.select("-__v")
		.lean()
		.limit(limit)
		.exec();
};

module.exports = mongoose.model('Movie', MovieSchema);