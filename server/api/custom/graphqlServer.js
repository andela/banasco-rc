import express from "express";
import GraphQLHTTP from "express-graphql";
import schema from "./graphqlSchema";
import axios from "axios";
// const schema = require("./graphqlSchema");
const app = express();
const PORT = 8000;
app.use("/graphql", GraphQLHTTP({
  schema,
  graphiql: true
})
);
app.get("/api/products", (request, response) => {
  axios.post(`http://localhost:${PORT}/graphql`,
    {"query": "{ products {title }}"},
    {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(function (res) {
      console.log(res.data);
      response.json(res.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});


// app.use()
app.listen(PORT, () => {
  console.log("Node/Express server for Flux/GraphQL app. listening on port", PORT);
});
