const { Schema, model } = require("mongoose");

// Define the schema for the Tree model
const treeSchema = new Schema({
  commonName: {type: String, required: true},
  variety: { type: String },
  dbh: { type: String }, //choose from fixed list //make required
  notes: { type: String },
  photos: { //store url for images
    bark: { type: String, unique: true },
    summerLeaf: { type: String, unique: true },
    autumnLeaf: { type: String, unique: true },
    fruit: { type: String, unique: true },
    flower: { type: String, unique: true },
    environs: { type: String, unique: true }
  },
  lastVisited: { type: Date, required: true }, //automatically generated when the data is input or updated
  location: { 
    northing: { type: Number, required: true }, //always positive at SC
    easting: { type: Number, required: true } //always negative at SC
  },
  garden: { type: String}, //choose from fixed list //make required
  siteInfo: {
    slope: { type: Boolean },
    overheadLines: { type: Boolean },
    treeCluster: { type: Boolean },
    proximateStructure: { type: Boolean },
    proximateFence: { type: Boolean }
  },
  installedDate: { type: String },
  installedBy: { type: String },
  felledDate: { type: String },
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

const Tree = model("Tree", treeSchema);

module.exports = Tree;