const { Schema, model } = require('mongoose');

// Define the schema for the Tree model
const treeSchema = new Schema({
  lastVisited: { type: Date, required: true }, //automatically generated when the data is input or updated
  species: { //compile common + scientific species names from db; user to choose one or the other from list or key in new
    commonName: {type: String, required: true},
    scientificName: {type: String, required: true}
    },
  genus: { type: String, required: true }, //automatically completed from the first word in the scientific name
  variety: { type: String },
  garden: { type: String, required: true }, //choose from fixed list
  location: { 
    northing: { type: Number, required: true }, //always positive at SC
    easting: { type: Number, required: true } //always negative at SC
    },
  installedDate: { type: Date },
  felledData: { type: Date },
  dbh: { type: String, required: true }, //choose from fixed list
  careHistory: {type: String },
  maintenanceNeeds: [
    {
      install: { type: Boolean},
      fell: { type: Boolean},
      priorityPrune: { type: Boolean},
      routinePrune: { type: Boolean},
      trainingPrune: { type: Boolean},
      installGrate: { type: Boolean },
      removeGrate: { type: Boolean},
      removeStump: { type: Boolean},
      raiseCrown: { type: Boolean},
      pestTreatment: { type: Boolean}
    }
  ],
  siteInfo: [
    {
      slope: { type: Boolean },
      overheadLines: { type: Boolean },
      proximateStructure: { type: Boolean },
      proximateFence: { type: Boolean },
      treeCluster: { type: Boolean },
    }
  ],
  photo: { type: String } //store base64-encoded image as string; see ChatGPT for instructions on how to convert the image to a base64 string
});

const Tree = model('Tree', treeSchema);

module.exports = Tree;