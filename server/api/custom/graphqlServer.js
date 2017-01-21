import express from "express";
import GraphQLHTTP from "express-graphql";
import schema from "./graphqlSchema";
import axios from "axios";
var NpmModuleBcrypt = Package['npm-bcrypt'].NpmModuleBcrypt;
// const schema = require("./graphqlSchema");
const app = express();
const PORT = 8000;
app.use("/graphql", GraphQLHTTP({
  schema,
  graphiql: true,
  pretty: true
})
);
app.get("/api/products", Meteor.bindEnvironment((request, response) => {
  axios.post(`http://${request.headers.host}/graphql`,
    {query: "{ products {title _id vendor price inventoryQuantity}}"},
    {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(function (res) {
      response.json(res.data);
    })
    .catch(function (error) {
      response.send(error);
    });
}));

app.get("/api/users", (request, response) => {
  axios.post(`http://${request.headers.host}/graphql`,
    {query: `
      {
        users {
          userId
          shopId
          fullName
          emails
          verified
          createdAt
        }

      }`
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(function (res) {
      response.json(res.data);
    })
    .catch(function (error) {
      response.send(error);
    });
});

app.get("/api/shops", (request, response) => {
  axios.post(`http://${request.headers.host}/graphql`,
    {query: `
      {
        shops {
          _id
          name
          emails
          lastUpdated
        }

      }`
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(function (res) {
      response.json(res.data);
    })
    .catch(function (error) {
      response.send(error);
    });
});


// app.use()
app.listen(PORT, () => {
  console.log("Node/Express server for Flux/GraphQL app. listening on port", PORT);
});

