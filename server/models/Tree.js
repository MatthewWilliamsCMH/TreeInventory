const { Schema, model } = require('mongoose');

//define the schema for the Tree model
const treeSchema = new Schema({
  commonName: {type: String, required: true},
  // species: { type: Schema.Types.ObjectId, ref: 'Species', required: true },
  variety: { type: String },
  dbh: { type: String }, //require once all trees have a value; use 'enum' to validate input?; create a file of constants for lists?
  notes: { type: String },
  photos: { //store url for images
    bark: { type: String },
    summerLeaf: { type: String },
    autumnLeaf: { type: String },
    fruit: { type: String },
    flower: { type: String },
    environs: { type: String }
  },
  lastUpdated: { type: Date, required: true }, //auto generated
  location: { 
    northing: { type: Number, required: true }, //always positive at SC
    easting: { type: Number, required: true } //always negative at SC
  },
  garden: { type: String }, //require when all trees have a value; use 'enum' to validate input?; create a file of constants for lists?
  siteInfo: {
    slope: { type: Boolean, required: true, default: false },
    overheadLines: { type: Boolean, required: true, default: false },
    treeCluster: { type: Boolean, required: true, default: false },
    proximateStructure: { type: Boolean, required: true, default: false },
    proximateFence: { type: Boolean, required: true, default: false },
    propertyLine: { type: Boolean, required: true, default: false }
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
  hidden: { type: Boolean, required: true, default: false }
});

const Tree = model('Tree', treeSchema);

module.exports = Tree;