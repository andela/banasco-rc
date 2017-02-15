import { SimpleSchema } from "meteor/aldeed:simple-schema";

/**
 * Notification Schema
 */

export const Notification = new SimpleSchema({
  userId: {
    type: String
  },
  name: {
    type: String
  },
  type: {
    type: String,
    optional: true
  },
  orderId: {
    type: String
  }
});
