const { Schema, model } = require('mongoose');

// Define the schema for the Tree model
const treeSchema = new Schema({
  commonName: {type: String, required: true},
  species: { type: Schema.Types.ObjectId, ref: 'Species', required: true },
  variety: { type: String },
  dbh: { type: String }, //require once all trees have a value; can add 'enum' to this to validate input; create a file of constants for lists?
  notes: { type: String },
  photos: { //store url for images
    bark: { type: String, unique: true },
    summerLeaf: { type: String, unique: true },
    autumnLeaf: { type: String, unique: true },
    fruit: { type: String, unique: true },
    flower: { type: String, unique: true },
    environs: { type: String, unique: true }
  },
  lastUpdated: { type: Date, required: true }, //automatically generated when the data is input or updated
  location: { 
    northing: { type: Number, required: true }, //always positive at SC
    easting: { type: Number, required: true } //always negative at SC
  },
  garden: { type: String }, //require once all trees have a value; can add 'enum' to this to validate input; create a file of constants for lists?
  siteInfo: {
    slope: { type: Boolean, required: true, default: false },
    overheadLines: { type: Boolean, required: true, default: false },
    treeCluster: { type: Boolean, required: true, default: false },
    proximateStructure: { type: Boolean, required: true, default: false },
    proximateFence: { type: Boolean, required: true, default: false }
  },
  installedDate: { type: String },
  installedBy: { type: String },
  felledDate: { type: String },
  felledBy: { type: String },
  careNeeds: {
    install: { type: Boolean, required: true, default: false },
    raiseCrown: { type: Boolean, required: true, default: false },
    routinePrune: { type: Boolean, required: true, default: false },
    trainingPrune: { type: Boolean, required: true, default: false },
    priorityPrune: { type: Boolean, required: true, default: false },
    pestTreatment: { type: Boolean, required: true, default: false },
    installGrate: { type: Boolean, required: true, default: false },
    removeGrate: { type: Boolean, required: true, default: false },
    fell: { type: Boolean, required: true, default: false },
    removeStump: { type: Boolean, required: true, default: false }
  },
  careHistory: {type: String },
  hidden: { type: Boolean, required: true, default: false }
});

const Tree = model('Tree', treeSchema);

module.exports = Tree;