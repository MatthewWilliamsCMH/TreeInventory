const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { connectDB } = require("./config/connection");
const { typeDefs } = require("./schemas/typeDefs");
const { resolvers } = require("./schemas/resolvers");
const path = require("path") 
const cors = require("cors");
require("dotenv").config;

const app = express();
const port = process.env.PORT || 3001;

//connect to db
connectDB();

//establish apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.start().then(() => { //not sure what this is for
  app.use("/graphql", expressMiddleware(server));
})

//enable cors to allow front-end and back-end ports to connect in any enviroment
app.use(cors());
app.use(express.json());

//start server //why do we need this start AND server.start above?
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});