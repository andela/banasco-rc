import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { PackageConfig } from "/lib/collections/schemas/registry";

export const PaystackPackageConfig = new SimpleSchema([
  PackageConfig, {
    "settings.mode": {
      type: Boolean,
      defaultValue: true
    },
    "settings.publicKey": {
      type: String,
      label: "API Key",
      optional: true
    },
    "settings.secretKey": {
      type: String,
      label: "Secret Key",
      optional: true
    }
  }
]);
