import _ from "lodash";
import { check } from "meteor/check";
import { Meteor } from "meteor/meteor";
import { Accounts, Orders } from "/lib/collections";
import { Reaction } from "/server/api";
import moment from "moment";

Meteor.methods({

  /**
   * analytics/getOrders
   * @summary returns all the orders made.
   * @return {Object} - all orders made
   */
  "analytics/getOrders": function () {
    const result = Orders.find({
      "workflow.status": "coreOrderWorkflow/completed"
    }, { sort: {createdAt: 1}}).fetch();
    return result;
  },

  /**
   * analytics/getProductSales
   * @summary makes total number of product sales available.
   * @param {String} fromDate - fromDate
   * @param {String} toDate - toDate
   * @return {Array} - returns product sales for various periods.
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
    let allOrders = Meteor.call("analytics/getOrders");
    let productData = {};
    let limitSearchRange;
    let limStartDateRange;
    let limEndDateRange;

    if (tDate[2] - fDate[2] === 0) {
      allOrders = allOrders.filter((order) =>
        order.createdAt.toISOString().slice(0, 4) === fDate[2]
      );
    }

    allOrders.forEach((order) => {
      // If the search is beyond a year, use the years for representing the data.
      if (tDate[2] - fDate[2] !== 0) {
        limStartDateRange = fDate[2];
        limEndDateRange = tDate[2];
        limitSearchRange = order.createdAt.toISOString().slice(0, 4);
      } else if (((tDate[0] - fDate[0]) !== 0) && (tDate[2] - fDate[2] === 0)) {
        // Check if search is beyond the same month
        const firstMonth = fDate[0];
        const lastMonth = tDate[0];
        const formatFirstMonth = moment().month(firstMonth).format("M");
        const formatLasttMonth = moment().month(lastMonth).format("M");

        limStartDateRange = formatLasttMonth;
        limEndDateRange = formatFirstMonth;
        const date = Number(order.createdAt.toISOString().slice(6, 7));
        limitSearchRange = date;
      } else {
        limStartDateRange = fromDate;
        limEndDateRange = toDate;
        limitSearchRange = order.createdAt.toISOString();
      }

      if ((limitSearchRange >= limStartDateRange) && (limitSearchRange <= limEndDateRange)) {
        if (limitSearchRange <= 12) {
          limitSearchRange = moment.months(limitSearchRange);
        }
        order.items.forEach((item) => {
          if (productData.name === limitSearchRange) {
            productData.value += item.quantity;
          } else {
            productData = {
              name: limitSearchRange,
              value: item.quantity
            };
          }
        });
      }
      if ((!_.includes(graphData, productData)) && !_.isEmpty(productData)) {
        graphData.push(productData);
      }
    });
    const filteredData = _.uniqBy(graphData, "name");
    return filteredData;
  },

  /**
   * analytics/getUserRoles
   * @summary Ratio of userRoles
   * @return {Array} - returns all of objects with user role information.
   */
  "analytics/getUserRoles": function () {
    const count = [];
    const users = Accounts.find({}).fetch();
    let total = 0;

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
        total += 1;
      } else if (user.userType === "vendor") {
        count[2].value += 1;
        total += 1;
      } else {
        count[0].value += 1;
        total += 1;
      }
    });

    count.forEach((userRole) => {
      const currValue = userRole.value;
      userRole.value = ((currValue / total) * 100);
    });

    return count;
  },

  "analytics/getVendorName": function (vendorId) {
    check(vendorId, String);
    const findVendor = Accounts.find({
      _id: vendorId
    }).fetch();
    return findVendor[0].profile.vendorDetails.vendorName;
  },

  /**
   * analytics/getTopVendors
   * @summary Returns top vendors
   * @return {Array} - returns data on vendors
   */
  "analytics/getTopVendors": function () {
    const allOrders = Meteor.call("analytics/getOrders");
    const totalData = [];
    let vendorData = {};
    let vendorName;

    allOrders.forEach((order) => {
      order.items.forEach((item) => {
        const vendorId = item.vendorId;

        if (vendorId) {
          vendorName = Meteor.call("analytics/getVendorName", vendorId);
        } else {
          vendorName = "Reaction Shop";
        }

        if (vendorData.name === vendorName) {
          vendorData.value += 1;
        } else {
          vendorData = {
            name: vendorName,
            value: 1
          };
        }
      });

      if (!_.includes(totalData, vendorData)) {
        totalData.push(vendorData);
      }
    });

    const filteredData = _.uniqBy(totalData, "name");
    return filteredData;
  },

  /**
   * analytics/getUserRetention
   * @summary Provides infomation on the most active users.
   * @return {Array} - returns an array with data on the most active users.
   */
  "analytics/getUserRetention": function () {
    const userRetention = [];
    let userData = {};
    const users = Accounts.find({}).fetch();

    users.forEach((user) => {
      const userId = user._id;
      const loginCount = user.loginCount;
      const userDetails = Meteor.users.find({
        _id: userId
      }).fetch();
      const userName = userDetails[0].username;

      if (userData.name === userName) {
        userData.value = loginCount;
      } else {
        userData = {
          name: userName,
          value: loginCount
        };
      }

      if (!_.includes(userRetention, userData)) {
        userRetention.push(userData);
      }
    });
    return userRetention;
  }
});
