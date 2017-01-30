import express from "express";
import GraphQLHTTP from "express-graphql";
import schema from "./graphqlSchema";
import axios from "axios";

const app = express();
const PORT = 8000;
app.use("/graphql", GraphQLHTTP({
  schema,
  graphiql: true,
  pretty: true
}));

app.get("/api/products", (request, response) => {
  axios.post(`http://${request.headers.host}/graphql`,
    {query: "{products {title _id vendor price inventoryQuantity}}"},
    {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((res) => {
      response.status(200).json(res.data);
    })
    .catch((error) => {
      response.status(400).send(error);
    });
});

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
    .then((res) => {
      response.status(200).json(res.data);
    })
    .catch((error) => {
      response.status(400).send(error);
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
    .then((res) => {
      response.status(200).json(res.data);
    })
    .catch((error) => {
      response.status(400).send(error);
    });
});

app.get("/api/ordered_products/:emailID", (request, response) => {
  const emailID = request.params.emailID.replace(/"/g, "");
  axios.post(`http://${request.headers.host}/graphql`,
    {query: `
      {
        orders (emailID: "${emailID}") {
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
    .then((res) => {
      if (res.data.data.orders.length) {
        response.status(200).json(res.data);
      }
      response.status(404).send("No Data Found for Orders");
    })
    .catch((error) => {
      response.status(400).send(error);
    });
});

app.get("/api/processed_orders/:emailID", (request, response) => {
  const emailID = request.params.emailID.replace(/"/g, "");
  axios.post(`http://${request.headers.host}/graphql`,
    {query: `
      {
        orders (
          emailID: "${emailID}",
          orderStatus: "coreOrderWorkflow/completed"
        )
        {
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
    .then((res) => {
      if (res.data.data.orders.length) {
        response.status(200).json(res.data);
      }
      response.status(404).send("No Data Found for Orders");
    })
    .catch((error) => {
      response.status(400).send(error);
    });
});

app.get("/api/cancelled_orders/:emailID", (request, response) => {
  const emailID = request.params.emailID.replace(/"/g, "");
  axios.post(`http://${request.headers.host}/graphql`,
    {query: `
      {
        orders (emailID: "${emailID}",
        orderStatus: "coreOrderWorkflow/canceled"
        )
        {
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
    .then((res) => {
      if (res.data.data.orders.length) {
        response.status(200).json(res.data);
      }
      response.status(404).send("No Data Found for Orders");
    })
    .catch((error) => {
      response.status(400).send(error);
    });
});
// app.use()
/* eslint no-console: 0 */
app.listen(PORT, () => {
  console.log("Node/Express server for GraphQL app. listening on port", PORT);
});
