import {Products, Orders, Shops, Accounts, Cart, AnalyticsEvents, Assets, Discounts, Emails, Inventory, Packages, Revisions, Shipping, Tags, Templates, Themes, Translations} from "/lib/collections";


// Global API configuration
const Api = new Restivus({
  useDefaultAuth: true,
  prettyJson: true
});

// Generates: GET, POST on /api/Products and GET, PUT, DELETE on
// /api/Products/:id for the Products collection
Api.addCollection(Products);

// Generates: GET, POST on /api/Products and GET, PUT, DELETE on
// /api/Products/:id for the Products collection
Api.addCollection(Orders);

// Generates: GET, POST on /api/Products and GET, PUT, DELETE on
// /api/Products/:id for the Products collection
Api.addCollection(Shops);

// Generates: GET, POST on /api/Products and GET, PUT, DELETE on
// /api/Products/:id for the Products collection
Api.addCollection(Accounts);

// Generates: GET, POST on /api/Products and GET, PUT, DELETE on
// /api/Products/:id for the Products collection
Api.addCollection(Cart);
Api.addCollection(AnalyticsEvents);
Api.addCollection(Assets);
Api.addCollection(Discounts);
Api.addCollection(Emails);
Api.addCollection(Inventory);
Api.addCollection(Packages);
Api.addCollection(Revisions);
Api.addCollection(Shipping);
Api.addCollection(Templates);
Api.addCollection(Themes);
Api.addCollection(Tags);
Api.addCollection(Translations);

// Api.addCollection(Products, {
//   routeOptions: {
//     authRequired: true
//   },
//   endpoints: {
//     post: {
//       authRequired: false
//     },
//     delete: {
//       roleRequired: 'admin'
//     }
//   }
// });
