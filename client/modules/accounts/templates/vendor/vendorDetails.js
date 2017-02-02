/* global $:true */
/* global Alerts:true */

import { Meteor } from "meteor/meteor";
import * as Collections from "/lib/collections";
import { Template } from "meteor/templating";

let currentDetails = {};
const errors = {};

Template.vendorDetails.onCreated(() => {
  $(".save-btn").addClass("btn-disabled");
});

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
  "change .form-control": function (event, template) {
    template.$(".save-btn").removeClass("btn-disabled");
  },

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
      return Alerts.toast("Already up to date. Nothing has changed");
    }
    Meteor.call("accounts/updateShopDetails", vendorDetails, (error, result) => {
      if (error) {
        return Alerts.toast("Unable to update details", "error");
      }
      if (result) {
        Alerts.toast("Shop details successfully updated");
      }
    });
  }
});
