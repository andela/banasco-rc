import { LoginFormSharedHelpers } from "/client/modules/accounts/helpers";
import { Session } from "meteor/session";
import { Meteor } from "meteor/meteor";
import { Countries } from "/client/collections";
import * as Collections from "/lib/collections";
import { Template } from "meteor/templating";

Template.vendorDetails.helpers({
  getVendorDetails() {
    const findVendor = Collections.Accounts.findOne({
      userId: Meteor.userId()
    });

    return {
      vendorDetails: findVendor.profile.vendorDetails
    };
  },
});
