import { LoginFormSharedHelpers } from "/client/modules/accounts/helpers";
import { Session } from "meteor/session";
import { Meteor } from "meteor/meteor";
import { Countries } from "/client/collections";
import * as Collections from "/lib/collections";
import { Template } from "meteor/templating";

let currentDetails = {};
const errors = {}

Template.vendorDetails.helpers({
  getVendorDetails() {
    const findVendor = Collections.Accounts.findOne({
      userId: Meteor.userId()
    });
    currentDetails = findVendor.profile.vendorDetails;
    return {
      vendorDetails: currentDetails
    };
  }
});

Template.vendorDetails.events({
  "click [data-event-action=updateVendorDetails]": function (event, template) {
    const vendorName = template.$(".vendor-name").val();
    const vendorPhone = template.$(".vendor-phone").val();
    const vendorAddr = template.$(".vendor-addr").val();
    const vendorDetails = {};

    if (!vendorPhone || vendorPhone.length < 11 || /[^\d{11}]/.test(vendorPhone)) {
      errors.vendorPhone = { i18nKeyReason: "Invalid phone number", reason: "Invalid phone number" };
    }

    if (!vendorAddr || !/[\w+\s\/,?]+(\.)?/.test(vendorAddr)) {
      errors.vendorAddr = { i18nKeyReason: "Invalid address", reason: "Invalid address" };
    }

    vendorDetails.vendorName = vendorName;
    vendorDetails.vendorPhone = vendorPhone;
    vendorDetails.vendorAddr = vendorAddr;

    if (currentDetails.vendorPhone === vendorDetails.vendorPhone
      && currentDetails.vendorAddr === vendorDetails.vendorAddr) {
      return 0;
    }
    return Meteor.call("accounts/updateVendorDetails", vendorDetails);
  }
});
