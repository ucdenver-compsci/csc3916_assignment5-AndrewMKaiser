var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const reviewSchema = new Schema({
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    username: String,
    review: String,
    rating: { type: Number, min: 0, max: 5 }
});

reviewSchema.pre('save', async function(next) {
    const review = this;

    if (!review.movieId || !review.username || !review.review || !review.rating) {
        return next(new Error('All fields are required'));
    }

    try {
        // Check if the movie with the specified movieId exists
        const movie = await mongoose.model('Movie').findById(review.movieId);
        if (!movie) {
            return next(new Error('Movie does not exist'));
        }
    } catch (error) {
        return next(error);
    }

    next();
});

module.exports = mongoose.model('Review', reviewSchema);