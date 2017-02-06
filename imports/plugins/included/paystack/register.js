/* eslint camelcase: 0 */
import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "Paystack",
  name: "paystack-payment",
  icon: "fa fa-credit-card-alt",
  autoEnable: true,
  settings: {
    mode: false,
    apiKey: ""
  },
  registry: [
    // Dashboard card
    {
      provides: "dashboard",
      label: "Paystack Payment Method",
      description: "Paystack payment provider",
      icon: "fa fa-credit-card-alt",
      priority: 1,
      container: "paymentMethod"
    },

    // Settings panel
    {
      label: "Paystack Payment Settings",
      route: "/dashboard/paystack",
      provides: "settings",
      container: "dashboard",
      template: "paystackSettings"
    },

    // Payment form for checkout
    {
      template: "paystackPaymentForm",
      provides: "paymentMethod"
    }
  ]
});
