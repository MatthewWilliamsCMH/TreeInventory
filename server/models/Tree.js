const { Schema, model } = require('mongoose');

// Define the schema for the Tree model
const treeSchema = new Schema({
  species: { //compile common + scientific species names from db; user to choose one or the other from list or key in new
    commonName: {type: String}, //make required
    scientificName: {type: String} //make reqruired
  },
  variety: { type: String },
  dbh: { type: String }, //choose from fixed list //make required
  notes: { type: String },
  photos: { //store url for images
    bark: {type: String},
    summerLeaf: {type: String},
    autumnLeaf: {type: String},
    fruit: {type: String},
    flower: {type: String},
    environs: {type: String}
  },
  nonnative: { type: Boolean },
  invasive: { type: Boolean },
  lastVisited: { type: Date, required: true }, //automatically generated when the data is input or updated
  location: { 
    northing: { type: Number }, //always positive at SC //make required
    easting: { type: Number } //always negative at SC //make required
  },
  garden: { type: String}, //choose from fixed list //make required
  siteInfo: {
    slope: { type: Boolean },
    overheadLines: { type: Boolean },
    treeCluster: { type: Boolean },
    proximateStructure: { type: Boolean },
    proximateFence: { type: Boolean }
  },
  installedDate: { type: Date },
  installedBy: { type: String },
  felledDate: { type: Date },
  felledBy: { type: String },
  maintenanceNeeds: {
    install: { type: Boolean },
    raiseCrown: { type: Boolean },
    routinePrune: { type: Boolean },
    trainingPrune: { type: Boolean },
    priorityPrune: { type: Boolean },
    pestTreatment: { type: Boolean },
    installGrate: { type: Boolean },
    removeGrate: { type: Boolean },
    fell: { type: Boolean },
    removeStump: { type: Boolean }
  },
  careHistory: {type: String },
  hidden: { type: Boolean }
});

const Tree = model('Tree', treeSchema);

module.exports = Tree;