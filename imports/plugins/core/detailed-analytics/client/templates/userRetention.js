import { Meteor } from "meteor/meteor";

Template.userRetention.helpers({
  result() {
    Meteor.call("analytics/getUserRetention", (error, result) => {
      result.sort(function (obj1, obj2) {
        return obj2.value - obj1.value;
      });
      Session.set("result", result);
    });
    const userData = Session.get("result");
    return userData;
  }
});
