import express from "express";
import GraphQLHTTP from "express-graphql";
import schema from "./graphqlSchema";
import {Products, Orders, Shops, Accounts, Cart, AnalyticsEvents, Assets, Discounts, Emails, Inventory, Packages, Revisions, Shipping, Tags, Templates, Themes, Translations} from "/lib/collections";
// const schema = require("./graphqlSchema");
const app = express();
const PORT = 8000;
app.use("/graphql", GraphQLHTTP({
  schema,
  graphiql: true
})
);
app.get("/api/products", (request, response) => {
  console.log(Products);
  // Products.find({}, (error, data) => {
    // response.send(data);
  // });
  response.send('Api is working');
}
);
// app.use()
app.listen(PORT, () => {
  console.log("Node/Express server for Flux/GraphQL app. listening on port", PORT);
});
