import { Template } from "meteor/templating";
import { Reaction } from "/client/api";
import { Packages } from "/lib/collections";
import { PaystackPackageConfig } from "../../lib/collections/schemas";

import "./paystack.html";


Template.paystackSettings.helpers({
  PaystackPackageConfig() {
    return PaystackPackageConfig;
  },
  packageData() {
    return Packages.findOne({
      name: "paystack-payment",
      shopId: Reaction.getShopId()
    });
  }
});

AutoForm.hooks({
  "paystack-update-form": {
    onSuccess: function () {
      Alerts.removeSeen();
      return Alerts.add("Paystack payment setting updated successfully", "success");
    },
    onError: function (operation, error) {
      Alerts.removeSeen();
      return Alerts.add("Paystack Payment Method settings update failed. " + error, "danger");
    }
  }
});
