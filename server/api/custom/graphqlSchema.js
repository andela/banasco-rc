import {
 GraphQLSchema,
 GraphQLObjectType,
 GraphQLInt,
 GraphQLString,
 GraphQLList,
 GraphQLNonNull,
 GraphQLID,
 GraphQLBoolean,
 GraphQLFloat
} from 'graphql';
import {Products, Orders, Shops, Accounts, Cart, AnalyticsEvents, Assets, Discounts, Emails, Inventory, Packages, Revisions, Shipping, Tags, Templates, Themes, Translations} from "/lib/collections";

const ProductsType = new GraphQLObjectType({
  name: "Products",
  description: "Returns a filtered subset of Products",
  fields: () => ({
    title: { type: GraphQLString },
    ancestors: { type: GraphQLString },
    optionTitle: { type: GraphQLString },
    price: { type: GraphQLString },
    inventoryManagement: { type: GraphQLBoolean },
    inventoryPolicy: { type: GraphQLBoolean },
    inventoryQuantity: { type: GraphQLInt},
    isVisible: { type: GraphQLBoolean}
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
    test: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: () => {
        return "Hello World";
      }
    }
  })
});

const schema = new GraphQLSchema({
  query
});
export default schema;
