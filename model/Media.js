const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  data: Buffer,
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;