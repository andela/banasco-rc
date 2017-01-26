import { LoginFormSharedHelpers } from "/client/modules/accounts/helpers";
import { Template } from "meteor/templating";
import { FlowRouter } from "meteor/kadira:flow-router-ssr";

/**
 * onCreated: Login form sign up view
 */
Template.loginFormSignUpView.onCreated(() => {
  const template = Template.instance();

  template.uniqueId = Random.id();
  template.formMessages = new ReactiveVar({});
  template.type = "signUp";
  Session.set("isVendor", false);
});

/**
 * Helpers: Login form sign up view
 */
Template.loginFormSignUpView.helpers(LoginFormSharedHelpers);

/**
 * Events: Login form sign up view
 */
Template.loginFormSignUpView.events({
  /**
   * Submit sign up form
   * @param  {Event} event - jQuery Event
   * @param  {Template} template - Blaze Template
   * @return {void}
   */
  // "change .form-check-input": function (event, template) {
  //   let isVendor = template.$(".form-check-input").prop("checked") ? true : false;
  // },
  "submit form": function (event, template) {
    event.preventDefault();

    const usernameInput = template.$(".login-input-username");
    const emailInput = template.$(".login-input-email");
    const passwordInput = template.$(".login-input-password");

    const username = usernameInput.val().trim();
    const email = emailInput.val().trim();
    const password = passwordInput.val().trim();

    const validatedUsername = LoginFormValidation.username(username);
    const validatedEmail = LoginFormValidation.email(email);
    const validatedPassword = LoginFormValidation.password(password);

    const templateInstance = Template.instance();
    const errors = {};

    let vendorDetails = {};
    let vendorName = "";
    let vendorPhone = "";
    let vendorAddr = "";

    templateInstance.formMessages.set({});

    if (validatedUsername !== true) {
      errors.username = validatedUsername;
    }

    if (validatedEmail !== true) {
      errors.email = validatedEmail;
    }

    if (validatedPassword !== true) {
      errors.password = validatedPassword;
    }

    if (LoginFormSharedHelpers.isVendor()) {
      vendorName = template.$(".login-input-vendorName").val();
      vendorPhone = template.$(".login-input-vendorPhone").val();
      vendorAddr = template.$(".login-input-vendorAddr").val();

      if (!vendorName || !/\w+/gi.test(vendorName)) {
        errors.vendorName = { i18nKeyReason: "Invalid vendor name", reason: "Invalid vendor name" };
      }

      if (!vendorPhone || vendorPhone.length < 11 || /[^\d{11}]/.test(vendorPhone)) {
        errors.vendorPhone = { i18nKeyReason: "Invalid phone number", reason: "Invalid phone number" };
      }

      if (!vendorAddr || !/[\w+\s\/,?]+(\.)?/.test(vendorAddr)) {
        errors.vendorAddr = { i18nKeyReason: "Invalid address", reason: "Invalid address" };
      }

      if (vendorName && vendorPhone && vendorAddr) {
        vendorDetails = {
          vendorName: vendorName,
          vendorPhone: vendorPhone,
          vendorAddr: vendorAddr,
          userType: Session.get("isVendor") || Session.get("isBuyer") || "buyer"
        };
      } else {
        vendorDetails = null;
      }
    }

    if ($.isEmptyObject(errors) === false) {
      templateInstance.formMessages.set({
        errors: errors
      });
      // prevent signup
      return;
    }

    const newUserData = {
      username: username,
      email: email,
      password: password,
      profile: {
        vendorDetails: vendorDetails
      },
      userType: Session.get("isVendor") || Session.get("isBuyer") || "buyer"
    };

    Accounts.createUser(newUserData, function (error) {
      if (Session.get("isVendor")) {
        Meteor.call("accounts/updateVendorDetails", vendorDetails);
      }
      if (error) {
        // Show some error message
        templateInstance.formMessages.set({
          alerts: [error]
        });
      } else {
         // Close dropdown or navigate to page
      }
    });
  },

  "change .form-radio-input": function (event) {
    const userType = event.target.value.toString().toLowerCase();

    if (userType === "vendor") {
      Session.set("isVendor", userType);
      Session.set("isBuyer", null);
    } else {
      Session.set("isBuyer", userType);
      Session.set("isVendor", null);
    }
  }
});
