const { Schema, model } = require('mongoose');

// Define the schema for the Tree model
const treeSchema = new Schema({
  lastVisited: { type: Date, required: true }, //automatically generated when the data is input or updated
  nonNative: { type: Boolean },
  invasive: { type: Boolean },
  species: { //compile common + scientific species names from db; user to choose one or the other from list or key in new
    commonName: {type: String, required: true},
    scientificName: {type: String, required: true}
    },
  variety: { type: String },
  garden: { type: String, required: true }, //choose from fixed list
  location: { 
    northing: { type: Number, required: true }, //always positive at SC
    easting: { type: Number, required: true } //always negative at SC
    },
  dbh: { type: String, required: true }, //choose from fixed list
  installedDate: { type: Date },
  indstalledBy: { type: String },
  felledDate: { type: Date },
  felledBy: { type: String },
  maintenanceNeeds: {
    install: { type: Boolean},
    raiseCrown: { type: Boolean},
    routinePrune: { type: Boolean},
    trainingPrune: { type: Boolean},
    priorityPrune: { type: Boolean},
    pestTreatment: { type: Boolean},
    installGrate: { type: Boolean },
    removeGrate: { type: Boolean},
    fell: { type: Boolean},
    removeStump: { type: Boolean}
  },
siteInfo: {
    slope: { type: Boolean },
    overheadLines: { type: Boolean },
    treeCluster: { type: Boolean },
    proximateStructure: { type: Boolean },
    proximateFence: { type: Boolean }
  },
  careHistory: {type: String },
  notes: { type: String },
  photos: { type: [String] } //store base64-encoded image as string; see ChatGPT for instructions on how to convert the image to a base64 string
});

const Tree = model('Tree', treeSchema);

module.exports = Tree;