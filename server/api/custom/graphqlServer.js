import express from "express";
import GraphQLHTTP from "express-graphql";
import schema from "./graphqlSchema";
import axios from "axios";
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

<<<<<<< HEAD
app.get("/api/ordered_products", (request, response) => {
  axios.post(`http://${request.headers.host}/graphql`,
    {query: `
      {
        orders {
          sessionId
          _id
          shopId
          email
          workflowStatus
          items {
            title
            quantity
            price
          }
          shipped
          tracking
          deliveryAddress {
            fullName
            country
            address1
            address2
            postal
            city
            region
            phone
          }
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

app.get("/api/processed_orders/:emailID", (request, response) => {
=======
app.get("/api/ordered_products/:emailID", (request, response) => {
>>>>>>> a05138d... feature: create user endpoints
  axios.post(`http://${request.headers.host}/graphql`,
    {query: `
      {
        orders (emailID: ${request.params.emailID}) {
          orderDate
          sessionId
          _id
          shopId
          email
          workflowStatus
          items {
            title
            quantity
            price
          }
          shipped
          tracking
<<<<<<< HEAD
          deliveryAddress {
            fullName
            country
            address1
            address2
            postal
            city
            region
            phone
          }
=======
>>>>>>> a05138d... feature: create user endpoints
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

<<<<<<< HEAD
app.get("/api/ordered_products/:emailID", (request, response) => {
  axios.post(`http://${request.headers.host}/graphql`,
    {query: `
      {
        orders (emailID: ${request.params.emailID}) {
=======
app.get("/api/processed_orders/:emailID", (request, response) => {
  axios.post(`http://${request.headers.host}/graphql`,
    {query: `
      {
        orders (
          emailID: ${request.params.emailID},
          orderStatus: "coreOrderWorkflow/completed"
        )
        {
>>>>>>> a05138d... feature: create user endpoints
          orderDate
          sessionId
          _id
          shopId
          email
          workflowStatus
          items {
            title
            quantity
            price
          }
          shipped
          tracking
<<<<<<< HEAD
=======
          deliveryAddress {
            fullName
            country
            address1
            address2
            postal
            city
            region
            phone
          }
>>>>>>> a05138d... feature: create user endpoints
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

app.get("/api/cancelled_orders/:emailID", (request, response) => {
  axios.post(`http://${request.headers.host}/graphql`,
    {query: `
      {
<<<<<<< HEAD
        orders (emailID: ${request.params.emailID}) {
=======
        orders (emailID: ${request.params.emailID},
        orderStatus: "coreOrderWorkflow/cancelled"
        )
        {
>>>>>>> a05138d... feature: create user endpoints
          orderDate
          sessionId
          _id
          shopId
          email
          workflowStatus
          items {
            title
            quantity
            price
          }
          shipped
          tracking
          deliveryAddress {
            fullName
            country
            address1
            address2
            postal
            city
            region
            phone
          }
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
  console.log("Node/Express server for GraphQL app. listening on port", PORT);
});
