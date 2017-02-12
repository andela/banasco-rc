import _ from  "lodash";
import { check } from "meteor/check";
import { Meteor } from "meteor/meteor";
import {  Orders } from "/lib/collections";
import { Reaction } from "/server/api";

Meteor.methods({

  "analytics/getOrders": function () {
    const result = Orders.find({
      "workflow.status": "coreOrderWorkflow/completed"
    }).fetch();
    return result;
  },

  "analytics/getDate": function () {

  },

  /**
   * analytics/getProductSales
   * @summary makes total number of product sales available.
   * @param {String} fromDate - fromDate
   * @param {String} toDate - toDate
   * @return {Number}
   */
  "analytics/getProductSales": function (fromDate, toDate) {
    check(fromDate, String);
    check(toDate, String);

    let graphData = [];

    if (!Reaction.hasPermission("createProduct")) {
      throw new Meteor.Error(403, "Access Denied");
    }

    const fDate = fromDate.split("/");
    const tDate = toDate.split("/");

    if (fDate[0] === tDate[0] && (tDate[1] - fDate[1]) <= 29) {
      const allOrders = Meteor.call("analytics/getOrders");
      let productData = {};

      allOrders.forEach((order) => {
        let date = new Date();
        date = date.toISOString().slice(0, 10);

        order.items.forEach((item) => {
          if (productData.name === date) {
            productData.value  += item.quantity;
          } else {
            productData = {
              name: date,
              value: item.quantity
            };
          }
        });
      });
      graphData.push(productData);
      return graphData;
    }
    return 0;
  }
});
