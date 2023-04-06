const mongoose = require('mongoose');

// Define a Schema
const albumSchema = new mongoose.Schema({
  title: String,
  artist: String,
  year: Number
});

// Create model from schema
const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
