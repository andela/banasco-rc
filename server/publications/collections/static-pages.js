import { Meteor } from "meteor/meteor";
import { StaticPages } from "/lib/collections";

Meteor.publish("StaticPages", () => {
  if (!this.userId) return this.ready();
  return StaticPages.find();
});