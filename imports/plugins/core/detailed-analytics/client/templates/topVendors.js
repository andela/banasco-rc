import { Meteor } from "meteor/meteor";

Template.topVendors.helpers({
  result() {
    Meteor.call("analytics/getTopVendors", (error, topVendors) => {
      topVendors.sort(function (obj1, obj2) {
        return obj2.value - obj1.value;
      });
      Session.set("topVendors", topVendors);
    });
    const vendorData = Session.get("topVendors");
    return vendorData;
  }
});
