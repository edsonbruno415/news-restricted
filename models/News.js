const mongoose = require('mongoose');

const News = new mongoose.Schema({
  title: String,
  content: String,
  category: String
});

module.exports = mongoose.model('News', News);