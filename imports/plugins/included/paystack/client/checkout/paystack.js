/* eslint camelcase: 0 */
/* eslint consistent-return: 0 */
/* eslint no-unused-vars: 0 */
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { Reaction } from "/client/api";
import { Cart, Shops, Accounts, Packages } from "/lib/collections";

import "./paystack.html";

finalizePayment = (paystackMethod) => {
  Meteor.call("cart/submitPayment", paystackMethod);
};

const getExchangeRate = () => {
  const shop = Shops.find(Reaction.getShopId()).fetch();
  return shop[0].currencies.NGN.rate;
};

const getCustomerEmail = () => {
  const user = Meteor.users.findOne(Meteor.userId());
  return user.emails[0].address;
};

const getOrderPrice = () => {
  const cart = Cart.findOne();
  const exchangeRate = getExchangeRate();
  return parseInt(cart.cartTotal() * exchangeRate, 10);
};

const getPaystackSettings = () => {
  const settings = Packages.findOne({
    name: "paystack-payment",
    shopId: Reaction.getShopId()
  });
  return settings;
};

const generateTransactionID = () => {
  return Random.id(16);
};

const handlePayment = (transactionId, paymentType) => {
  const paystackConfig = getPaystackSettings();
  HTTP.call("GET", `https://api.paystack.co/transaction/verify/${transactionId}`, {
    headers: {
      Authorization: `Bearer ${paystackConfig.settings.secretKey}`
    }
  }, function (error, response) {
    if (error) {
      Alerts.toast("Unable to verify payment", "error");
    } else if (response.data.data.status !== "success") {
      Alerts.toast("Payment was unsuccessful", "error");
    } else {
      const exchangeRate = getExchangeRate();
      const paystackResponse = response.data.data;
      paystackMethod = {
        processor: "Paystack",
        storedCard: paystackResponse.authorization.last4,
        method: "Paystack",
        transactionId: paystackResponse.reference,
        currency: paystackResponse.currency,
        amount: paystackResponse.amount,
        status: paystackResponse.status,
        mode: "authorize",
        createdAt: new Date()
      };
      if (paymentType === "payment") {
        paystackMethod.transactions = [];
        paystackMethod.transactions.push({
          amount: (paystackResponse.amount / 100),
          transactionId: paystackResponse.reference,
          currency: paystackResponse.currency
        });
        finalizePayment(paystackMethod);
      }
    }
  });
};

const payWithPaystack = (email, price, transactionId) => {
  const payStackDetails = getPaystackSettings();
  const handler = PaystackPop.setup({
    key: payStackDetails.settings.publicKey,
    email: email,
    amount: price * 100,
    ref: transactionId,
    callback: function (response) {
      handlePayment(response.reference, "payment");
    }
  });
  handler.openIframe();
};

Template.paystackPaymentForm.events({
  "click #paywithpaystack": (event) => {
    event.preventDefault();
    const accountDetails = Accounts.find(Meteor.userId()).fetch();
    const userMail = accountDetails[0].emails[0].address;
    const amount = getOrderPrice();
    const transactionId = generateTransactionID();
    const mailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/i;
    if (!mailRegex.test(userMail)) {
      Alerts.toast("Invalid email address", "error");
      return false;
    }
    payWithPaystack(userMail, amount, transactionId);
  }
});
