import { Reaction } from "/lib/api";
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { StaticPages } from "/lib/collections";

import "./static-pages.html";

Template.staticPageLayout.onCreated(function () {
  Meteor.subscribe("StaticPages");
});
