const { Schema, model } = require('mongoose');

// if (mongoose.models.treeSchema) {
//   delete mongoose.models.treeSchema;
// }
// Define the schema for the Tree model
const treeSchema = new Schema({
  lastVisited: { type: Date, required: true }, //automatically generated when the data is input or updated
  nonNative: { type: Boolean },
  invasive: { type: Boolean },
  species: { //compile common + scientific species names from db; user to choose one or the other from list or key in new
    commonName: {type: String}, //make required
    scientificName: {type: String} //make reqruired
  },
  variety: { type: String },
  garden: { type: String}, //choose from fixed list //make required
  location: { 
    northing: { type: Number }, //always positive at SC //make required
    easting: { type: Number } //always negative at SC //make required
  },
  dbh: { type: String }, //choose from fixed list //make required
  installedDate: { type: Date },
  indstalledBy: { type: String },
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
siteInfo: {
    slope: { type: Boolean },
    overheadLines: { type: Boolean },
    treeCluster: { type: Boolean },
    proximateStructure: { type: Boolean },
    proximateFence: { type: Boolean }
  },
  careHistory: {type: String },
  notes: { type: String },
  photos: { type: [String] }, //store url for image
  nonnative: { type: Boolean },
  invasive: { type: Boolean },
  hidden: { type: Boolean }
});

const Tree = model('Tree', treeSchema);

module.exports = Tree;