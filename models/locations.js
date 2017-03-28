const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LocationSchema = new Schema({
	movieId: {
		type: Schema.Types.ObjectId,
		ref: 'Movie',
		required: true
	},
	location: {
		type: String
	},
	loc: {
		type: [Number],
		index: '2d'
	}
});

/**
 * Get Movie Locations Based On Movie Id
 * @param id -- is the Movie Id used to find Movie
 * @returns {Promise}
 */

LocationSchema.statics.getLocations = function(id) {
	return this.find({
			movieId: id
		})
		.populate({path:'movieId',model:'Movie',select:"-__v"})
		.select("-__v")
		.lean()
		.exec();
};
module.exports = mongoose.model('Location', LocationSchema);