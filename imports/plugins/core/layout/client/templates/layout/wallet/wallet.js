/* eslint no-undef: 0 */
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { Reaction } from "/client/api";
import { Accounts, Packages, Wallets, Shops } from "/lib/collections";
import Alert from "sweetalert2";

Template.wallet.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    details: {
      balance: 0,
      transactions: []
    }
  });
  this.autorun(() => {
    this.subscribe("transactionInfo", Meteor.userId());
    const transactionDetail = Wallets.find().fetch();
    this.state.set("details", transactionDetail[0]);
  });
});
const getPaystackSettings = () => {
  const settings = Packages.findOne({
    name: "paystack-payment",
    shopId: Reaction.getShopId()
  });
  return settings;
};

const finalizeDeposit = (paystackMethod) => {
  Meteor.call("wallet/transaction", Meteor.userId(), paystackMethod.transactions, (err, res) => {
    if (res) {
      document.getElementById("depositAmount").value = "";
      Alerts.toast("Your deposit was successful", "success");
    } else {
      Alerts.toast("An error occured, please try again", "error");
    }
  });
};

const getExchangeRate = () => {
  const shop = Shops.find(Reaction.getShopId()).fetch();
  return shop[0].currencies.NGN.rate;
};

function handlePayment(result) {
  const type = "deposit";
  const transactionId = result.reference;
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
      if (type === "deposit") {
        paystackMethod.transactions = {
          amount: paystackResponse.amount / (100 * exchangeRate),
          referenceId: paystackResponse.reference,
          date: new Date(),
          transactionType: "Credit"
        };
        finalizeDeposit(paystackMethod);
      }
    }
  });
}

// Paystack payment
const payWithPaystack = (email, amount) => {
  const paystackConfig = getPaystackSettings();
  const handler = PaystackPop.setup({
    key: paystackConfig.settings.publicKey,
    email: email,
    amount: amount * 100,
    callback: handlePayment
  });
  handler.openIframe();
};

Template.wallet.helpers({
  getBalance() {
    const balance = Template.instance().state.get("details");
    return balance;
  },
  getTransactions() {
    const transacts = Template.instance().state.get("details");
    return transacts;
  }
});

Template.wallet.events({
  "submit #deposit": (event) => {
    event.preventDefault();
    const accountDetails = Accounts.find(Meteor.userId()).fetch();
    const userMail = accountDetails[0].emails[0].address;
    const mailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/i;
    if (!mailRegex.test(userMail)) {
      Alerts.toast("Invalid email address", "error");
      return false;
    }
    try {
      const amount = parseInt(document.getElementById("depositAmount").value, 10);
      if (amount > 100000) {
        Alert.toast("You can only deposit ₦100,000 per transaction", "error");
      } else {
        payWithPaystack(userMail, amount);
      }
    } catch (err) {
      Alerts.toast("Invalid Deposit Amount, You can only deposit ₦100,000 per transaction", "error");
    }
  },

  "submit #transfer": (event) => {
    event.preventDefault();
    const amount = parseInt(document.getElementById("transferAmount").value, 10) / getExchangeRate();
    const recipientEmail = document.getElementById("recipient").value;
    const mailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/i;
    if (amount > Template.instance().state.get("details").balance) {
      Alerts.toast("Insufficient balance", "error");
      return false;
    }
    if (isNaN(amount) || amount <= 0) {
      Alerts.toast("Amount being inputted should be valid", "error");
      return false;
    }
    if (recipientEmail === Accounts.findOne(Meteor.userId()).emails[0].address) {
      Alerts.toast("You cannot transfer money to yourself", "error");
      return false;
    }
    if (!mailRegex.test(recipientEmail)) {
      Alerts.toast("Invalid email address", "error");
    } else {
      Alert({
        title: `Are you sure you want to transfer $${amount} to ${recipientEmail}?`,
        text: "Funds will be deducted from your wallet",
        type: "warning",
        showConfirmButton: true,
        cancelButtonText: "Dismiss",
        showCancelButton: true
      }).then(() => {
        const transactions = { amount, to: recipientEmail, date: new Date(), transactionType: "Debit" };
        Meteor.call("wallet/transaction", Meteor.userId(), transactions, (err, res) => {
          if (res) {
            if (res === 1) {
              Alerts.toast(`Fund Transfer to ${recipientEmail} successful`);
            }
            if (res === 2) {
              Alerts.toast(`Email ${recipientEmail} does not exist in the reaction database`, "error");
              return false;
            }
            if (res === 3) {
              Alerts.toast("You cannot transfer money to yourself", "error");
              return false;
            }
          } else {
            Alerts.toast("An error occured, please try again", "error");
          }
        });
      }, (dismiss) => {
        return dismiss === "cancel" ? false : true;
      });
    }
  }
});
