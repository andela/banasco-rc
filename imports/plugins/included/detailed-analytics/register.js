/* eslint camelcase: 0 */
import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "Detailed Analytics",
  name: "reaction-detailedAnalytics",
  icon: "fa fa-bar-chart-o",
  container: "connect",
  autoEnable: true,
  settings: {
    name: "Detailed Analytics"
  },
  registry: [{
    route: "/dashboard/detailedAnalytics",
    name: "analyticsDashboard",
    provides: "dashboard",
    label: "Detailed Analytics",
    description: "Detailed Analytics on the performance of shops",
    template: "detailedAnalytics",
    icon: "fa fa-bar-chart-o",
    priority: 1,
    container: "connect"
  }]
});
