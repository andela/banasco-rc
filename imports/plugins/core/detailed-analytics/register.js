/* eslint camelcase: 0 */
import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "Actionable Analytics",
  name: "reaction-actionableAnalytics",
  icon: "fa fa-bar-chart-o",
  container: "core",
  autoEnable: true,
  settings: {
    name: "Actionable Analytics"
  },
  registry: [{
    route: "/dashboard/actionableAnalytics",
    name: "analyticsDashboard",
    provides: "dashboard",
    label: "Actionable Analytics",
    description: "Analyses performance of shops",
    template: "actionableAnalytics",
    icon: "fa fa-bar-chart-o",
    priority: 1,
    container: "core"
  }]
});
