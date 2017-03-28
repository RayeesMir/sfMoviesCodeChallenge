const movieModel = require('../models/movies')
const locationModel = require('../models/locations')
const Movies = require('../lib');
const config = require('../config');
const Elastic = require('../lib/elasticfeeder');
const elasticSource = new Elastic();


module.exports = {

    /**
	 * Controller Function to Handle Search/AutoComplete
     * @param request
     * @param response
     */
	searchMovies: function(request, response) {
		const searchTerm = request.query.movieName.toString();
		const term = new RegExp('\\b' + searchTerm.trim(), "i");
		const resultLimit = 11;

			///This Code Is Commented Becoz no need to use elastic search


			// elasticSource.searchMovies(searchTerm, 'sfmovies')
			// 	.then(function(result) {
			// 		console.log("inside", result.length)
			// 		if (!result.length) {
			// 			console.log("mongo result")
			// 			return movieModel.getMovies(term, resultLimit)
			// 		} else {
			// 			console.log("elastic result", result)
			// 			return result;
			// 		}
			// 	})

			
		movieModel.getMovies(term, resultLimit)
			.then(function(movies) {
				response.json({
					status: "success",
					movies: movies,
					code: 200
				})
			})
			.catch(function(error) {
				console.log(error)
				response.json({
					status: "error",
					result: "Internal Server Error",
					code: 500
				})
			})



	},
    /**
	 * return Locations Of Movie Based on movie Id
     * @param request
     * @param response
     */
	getLocations: function(request, response) {
		var id = request.params.id;
		locationModel.getLocations(id)
			.then(function(movies) {
				response.json({
					status: "success",
					movies: movies,
					code: 200
				})
			})
			.catch(function(error) {
				console.log(error);
				response.json({
					status: "error",
					result: "Internal Server Error",
					code: 500
				})
			})
	}
}