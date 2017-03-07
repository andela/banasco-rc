import { Media, Audio, Software, Video, Book } from "/lib/collections";
import { Reaction } from "/server/api";

/**
 * CollectionFS - Image/Video Publication
 * @params {Array} shops - array of current shop object
 */
Meteor.publish("Media", function (shops) {
  check(shops, Match.Optional(Array));
  let selector;
  const shopId = Reaction.getShopId();
  if (!shopId) {
    return this.ready();
  }
  if (shopId) {
    selector = {
      "metadata.shopId": shopId
    };
  }
  if (shops) {
    selector = {
      "metadata.shopId": {
        $in: shops
      }
    };
  }
  return Media.find(selector, {
    sort: {
      "metadata.priority": 1
    }
  });
});

Meteor.publish("audio", function (productId) {
  check(productId, String);
  let selector;
  const shopId = Reaction.getShopId();
  if (!shopId) {
    return this.ready();
  }
  if (shopId) {
    selector = {
      "metadata.shopId": shopId,
      "metadata.productId": productId
    };
  }

  return Audio.find(selector);
});

Meteor.publish("video", function (productId) {
  check(productId, String);
  let selector;
  const shopId = Reaction.getShopId();
  if (!shopId) {
    return this.ready();
  }
  if (shopId) {
    selector = {
      "metadata.shopId": shopId,
      "metadata.productId": productId
    };
  }

  return Video.find(selector);
});

Meteor.publish("book", function (productId) {
  check(productId, String);
  let selector;
  const shopId = Reaction.getShopId();
  if (!shopId) {
    return this.ready();
  }
  if (shopId) {
    selector = {
      "metadata.shopId": shopId,
      "metadata.productId": productId
    };
  }

  return Book.find(selector);
});

Meteor.publish("software", function (productId) {
  check(productId, String);
  let selector;
  const shopId = Reaction.getShopId();
  if (!shopId) {
    return this.ready();
  }
  if (shopId) {
    selector = {
      "metadata.shopId": shopId,
      "metadata.productId": productId
    };
  }

  return Software.find(selector);
});
