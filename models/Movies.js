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
    imageUrl: String,
    actors: [{
      actorName: String,
      characterName: String,
    }]
    
});

// Movie model
const Movie = mongoose.model('Movie', MovieSchema);

// return the model
module.exports = mongoose.model('Movie', MovieSchema);