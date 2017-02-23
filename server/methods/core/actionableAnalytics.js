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
    }, {
      sort: {
        createdAt: 1
      }
    }).fetch();
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

    let graphData = [];
    const years = [];
    const months = [];
    const monthRange = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Nov", "Dec"];

    if (!Reaction.hasPermission("createProduct")) {
      throw new Meteor.Error(403, "Access Denied");
    }

    const fDate = moment(fromDate, "MM-DD-YYYY");
    const tDate = moment(toDate, "MM-DD-YYYY");
    let allOrders = Meteor.call("analytics/getOrders");
    let productData = {};
    let limitSearchRange;
    let limStartDateRange;
    let limEndDateRange;

    // Filter data being processed for the months.
    if ((tDate.year() - fDate.year()) === 0) {
      // Chart Range for Month
      for (let month = 0; month < monthRange.length; month++) {
        productData = {
          name: monthRange[month],
          value: 0
        };
        months.push(productData);
      }
      allOrders = allOrders.filter((order) => {
        const orderYear = order.createdAt.toISOString().slice(0, 4);
        const currentYear = fDate.year();
        return currentYear === Number(orderYear);
      });
      graphData = graphData.concat(months);
    } else {
      // Chart Range for Year
      for (let year = fDate.year(); year <= tDate.year(); year++) {
        productData = {
          name: year,
          value: 0
        };
        years.push(productData);
      }
      graphData = graphData.concat(years);
    }

    const monthDiff = (tDate.month() + 1) - (fDate.month() + 1);
    const monthDiff2 = (tDate.year()) - (fDate.year());

    allOrders.forEach((order) => {
      // If the search is beyond a year, use the years for representing the data.
      if (tDate.year() - fDate.year() !== 0) {
        limStartDateRange = fDate.year();
        limEndDateRange = tDate.year();
        limitSearchRange = order.createdAt.toISOString().slice(0, 4);
        limitSearchRange = Number(limitSearchRange);
      } else if (monthDiff !== 0 && monthDiff2 === 0) {
        // Check if search is beyond the same month
        const firstMonth = fDate.month();
        const lastMonth = tDate.month();
        const formatFirstMonth = moment().month(firstMonth).format("M");
        const formatLasttMonth = moment().month(lastMonth).format("M");

        limStartDateRange = formatFirstMonth;
        limEndDateRange = formatLasttMonth;
        const date = Number(order.createdAt.toISOString().slice(6, 7));
        limitSearchRange = date;
      }

      if ((limitSearchRange >= limStartDateRange) && (limitSearchRange <= limEndDateRange)) {
        if (limitSearchRange <= 12) {
          limitSearchRange = (moment.months(limitSearchRange)).slice(0, 3);
        }

        order.items.forEach((item) => {
          let elementPos = graphData.map(function (x) {
            return x.name;
          }).indexOf(limitSearchRange);
          if (graphData[elementPos].name === limitSearchRange) {
            graphData[elementPos].value += item.quantity;
          }
        });
      }
    });

    return graphData;
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
      name: "admin: ",
      value: 0
    });
    count.push({
      name: "buyer: ",
      value: 0
    });
    count.push({
      name: "vendor: ",
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
      userRole.name += userRole.value;
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

    _.remove(totalData, {
      name: "Admin"
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
      const purchases = user.currentOrders;
      const userDetails = Meteor.users.find({
        _id: userId
      }).fetch();
      const userName = userDetails[0].username;

      if (userData.name === userName) {
        userData.value = loginCount;
      } else {
        userData = {
          name: userName,
          loginCount: loginCount,
          purchases: purchases
        };
      }

      if (!_.includes(userRetention, userData)) {
        userRetention.push(userData);
      }
    });
    return userRetention;
  }
});
