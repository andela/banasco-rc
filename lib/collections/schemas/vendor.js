import { Random } from "meteor/random";
import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { Metafield } from "./metafield";

/**
* Reaction Schemas Address
*/

export const Vendor = new SimpleSchema({
  _id: {
    type: String,
    defaultValue: Random.id(),
    optional: true
  },
  vendorName: {
    type: String,
    label: "Shop name",
    optional: true
  },
  vendorPhone: {
    type: String,
    label: "Official Phone",
    optional: true
  },
  vendorAddr: {
    label: "Shop Address",
    type: String,
    optional: true
  },
  userType: {
    label: "vendor",
    type: String,
    optional: true
  },
  metafields: {
    type: [Metafield],
    optional: true
  }
});
