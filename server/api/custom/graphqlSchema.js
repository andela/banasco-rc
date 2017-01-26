import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLID
} from "graphql";
import { Products, Orders, Shops, Accounts } from "/lib/collections";

const ProductsType = new GraphQLObjectType({
  name: "Products",
  description: "Returns select fields for all Products",
  fields: () => ({
    title: { type: GraphQLString },
    _id: { type: GraphQLString },
    vendor: { type: GraphQLString },
    price: {
      type: GraphQLString,
      resolve: (obj) => {
        if (obj.price.range) {
          return obj.price.range;
        }
        return obj.price;
      }
    },
    inventoryQuantity: { type: GraphQLInt }
  })
});

const UsersType = new GraphQLObjectType({
  name: "Users",
  description: "Returns select fields for all Users",
  fields: () => ({
    id: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    emails: {
      type: GraphQLString,
      resolve: (obj) => {
        if (!obj.emails.length) {
          return "No Email Specified";
        }
        return obj.emails[0].address;
      }
    },
    verified: {
      type: GraphQLString,
      resolve: (obj) => {
        if (obj.emails.length) {
          return obj.emails[0].verified;
        }
        return null;
      }
    },
    fullName: {
      type: GraphQLString,
      resolve: (obj) => {
        if (obj.profile.addressBook) {
          return obj.profile.addressBook[0].fullName;
        }
        return "No Name Supplied";
      }
    },
    userId: { type: GraphQLString },
    shopId: { type: GraphQLString }
  })
});


const ShopsType = new GraphQLObjectType({
  name: "Shops",
  description: "Returns Array of Shops",
  fields: () => ({
    name: { type: GraphQLString },
    _id: { type: GraphQLID },
    emails: {
      type: GraphQLString,
      resolve: (obj) => {
        return obj.emails[0].address;
      }
    },
    lastUpdated: {
      type: GraphQLString,
      resolve: (obj) => {
        return obj.updatedAt;
      }
    }
  })
});

const ShippingAddress = new GraphQLObjectType({
  name: "ShippingAddress",
  description: "Lists the Delivery Address",
  fields: () => ({
    fullName: { type: GraphQLString },
    country: { type: GraphQLString },
    address1: { type: GraphQLString },
    address2: { type: GraphQLString },
    postal: { type: GraphQLString },
    city: { type: GraphQLString },
    region: { type: GraphQLString },
    phone: { type: GraphQLString }
  })
});

const OrderItems = new GraphQLObjectType({
  name: "OrderItems",
  description: "Lists the Details of Products Ordered",
  fields: () => ({
    title: { type: GraphQLString },
    quantity: { type: GraphQLString },
    price: {
      type: GraphQLString,
      resolve: (obj) => {
        return obj.variants.price;
      }
    }
  })
});

const OrdersType = new GraphQLObjectType({
  name: "Orders",
  description: "Returns Array of Specified Orders",
  fields: () => ({
    sessionId: { type: GraphQLString },
    _id: { type: GraphQLID },
    shopId: { type: GraphQLString },
    workflowStatus: {
      type: GraphQLString,
      resolve: (obj) => {
        return obj.workflow.status;
      }
    },
    items: { type: new GraphQLList(OrderItems) },
    shipped: {
      type: GraphQLString,
      resolve: (obj) => {
        return obj.shipping[0].shipped;
      }
    },
    tracking: {
      type: GraphQLString,
      resolve: (obj) => {
        return obj.shipping[0].tracking;
      }
    },
    email: { type: GraphQLString },
    orderDate: {
      type: GraphQLString,
      resolve: (obj) => {
        return obj.createdAt;
      }
    },
    deliveryAddress: {
      type: ShippingAddress,
      resolve: (obj) => {
        return obj.shipping[0].address;
      }
    }
  })
});

const query = new GraphQLObjectType({
  name: "Query",
  description: "First GraphQL Server Config — Yay!",
  fields: () => ({
    products: {
      type: new GraphQLList(ProductsType),
      description: "Display Products",
      resolve: () => {
        return Products.find().fetch();
      }
    },
    users: {
      type: new GraphQLList(UsersType),
      description: "Display Users",
      resolve: () => {
        return Accounts.find().fetch();
      }
    },
    shops: {
      type: new GraphQLList(ShopsType),
      description: "Display Shops",
      resolve: () => {
        return Shops.find().fetch();
      }
    },
    orders: {
      type: new GraphQLList(OrdersType),
      description: "Display Orders",
      args: {
        emailID: { type: GraphQLString },
        orderStatus: { type: GraphQLString }
      },
      resolve: (root, args) => {
        if (!args.emailID) {
          return "Hey there! You must pass in a Parameter for this to work";
        } else if (args.emailID === "admin" && args.orderStatus) {
          return Orders.find({ "workflow.status": args.orderStatus }).fetch();
        } else if (args.emailID === "admin") {
          return Orders.find().fetch();
        } else if (args.orderStatus) {
          return Orders.find(
            { "email": args.emailID, "workflow.status": args.orderStatus })
            .fetch();
        }
        return Orders.find({ email: args.emailID }).fetch();
      }
    }
  })
});

const schema = new GraphQLSchema({
  query
});
export default schema;
