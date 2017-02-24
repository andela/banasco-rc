import { Template } from "meteor/templating";

Template.actionableAnalytics.events({
  "click div.analytics-tab-menu>div.list-group>a": function (event) {
    event.preventDefault();
    $(event.currentTarget).siblings("a.active").removeClass("active");
    $(event.currentTarget).addClass("active");
    const index = $(event.currentTarget).index();
    $("div.analytics-tab>div.analytics-tab-content").removeClass("active");
    $("div.analytics-tab>div.analytics-tab-content").eq(index).addClass("active");
  }
});
