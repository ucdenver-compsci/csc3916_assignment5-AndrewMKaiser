var mongoose = require('mongoose', { useUnifiedTopology: true });
var Schema = mongoose.Schema;

mongoose.connect(process.env.DB);

// Movie schema
const MovieSchema = new mongoose.Schema({
    title: { type: String, required: true, index: true },
    releaseDate: { type: Number, min: [1900, 'Must be greater than 1899'], max: [2100, 'Must be less than 2100']},
    genre: {
      type: String,
      enum: [
        'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller', 'Western', 'Science Fiction'
      ],
    },
    actors: [{
      actorName: String,
      characterName: String,
    }],
});

// Movie model
const Movie = mongoose.model('Movie', MovieSchema);

// Function to check for the presence of all fields before saving the movie
MovieSchema.pre('save', function(next) {
  const movie = this;

  // Check if all required fields are present
  if (!movie.title || !movie.releaseDate || !movie.genre || !movie.actors) {
    return next(new Error('All fields are required'));
  }

  next();
});

// return the model
module.exports = mongoose.model('Movie', MovieSchema);