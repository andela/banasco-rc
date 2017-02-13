import { check } from "meteor/check";
import {  Meteor } from "meteor/meteor";
import { Accounts, Orders } from "/lib/collections";
import { Reaction } from "/server/api";
import moment from "moment";

Meteor.methods({

  "analytics/getOrders": function () {
    const result = Orders.find({
      "workflow.status": "coreOrderWorkflow/completed"
    }).fetch();
    return result;
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

    const graphData = [];

    if (!Reaction.hasPermission("createProduct")) {
      throw new Meteor.Error(403, "Access Denied");
    }

    const fDate = fromDate.split("/");
    const tDate = toDate.split("/");
    const allOrders = Meteor.call("analytics/getOrders");
    let productData = {};

    /*

    if (fDate[0] === tDate[0] && (tDate[1] - fDate[1]) <= 28) {
    }

    if (((tDate[0] - fDate[0]) === 1)) {
      console.log("Date Format", tDate);
      allOrders.forEach((order) => {
        const date = Number(order.createdAt.toISOString().slice(6, 7));
        const dateInWords = moment.months(date);
        order.items.forEach((item) => {
          if (productData.name === dateInWords) {
            productData.value += item.quantity;
          } else {
            productData = {
              name: dateInWords,
              value: item.quantity
            };
          }
        });
        graphData.push(productData);
      });
      return graphData;
    }*/
/*

    if (((tDate[2] - fDate[2]) !== 0)) {
      allOrders.forEach((order) => {
        const year = order.createdAt.toISOString().slice(0, 4);
        order.items.forEach((item) => {
          if (productData.name === year) {
            productData.value += item.quantity;
          } else {
            productData = {
              name: year,
              value: item.quantity
            };
          }
        });
        graphData.push(productData);
      });
      return graphData;
    }
*/
    return 0;
  },

  /**
   * analytics/getUserType
   * @summary Ratio of userTypes
   */
  "analytics/getUserType": function () {
    const count = [];
    const users = Accounts.find({}).fetch();
    count.push({
      name: "admin",
      value: 0
    });
    count.push({
      name: "buyer",
      value: 0
    });
    count.push({
      name: "vendor",
      value: 0
    });

    users.forEach((user) => {
      if (user.userType === "buyer") {
        count[1].value += 1;
      } else if (user.userType === "vendor") {
        count[2].value += 1;
      } else {
        count[0].value += 1;
      }
    });

    return count;
  }
});
