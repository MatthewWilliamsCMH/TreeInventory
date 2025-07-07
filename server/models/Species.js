const { Schema, model } = require('mongoose');

//define the schema for the Species model
const speciesSchema = new Schema({
  family: {type: String, required: true},
  commonName: {type: String, required: true, unique: true},
  scientificName: {type: String, required: true, unique: true},
  markerColor: {type: String, required: true},
  nonnative: {type: Boolean, required: true},
  invasive: {type: Boolean, required: true}
});

const Species = model('Species', speciesSchema);

module.exports = Species;