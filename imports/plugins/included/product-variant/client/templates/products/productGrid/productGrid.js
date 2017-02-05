import _ from "lodash";
import { Session } from "meteor/session";
import { Template } from "meteor/templating";
import { Reaction } from "/client/api";
import Logger from "/client/modules/logger";
import { ReactionProduct } from "/lib/api";
import Sortable from "sortablejs";
import { Accounts } from "/lib/collections";

/**
 * productGrid helpers
 */

Template.productGrid.onCreated(function () {
  Session.set("productGrid/selectedProducts", []);
  Session.set("switchProducts", "vendor");
});

Template.productGrid.onRendered(function () {
  const instance = this;

  if (Reaction.hasPermission("createProduct")) {
    const productSort = $(".product-grid-list")[0];

    this.sortable = Sortable.create(productSort, {
      group: "products",
      handle: ".product-grid-item",
      onUpdate() {
        const tag = ReactionProduct.getTag();

        instance.$(".product-grid-item")
          .toArray()
          .map((element, index) => {
            const productId = element.getAttribute("id");
            const position = {
              position: index,
              updatedAt: new Date()
            };

            Meteor.call("products/updateProductPosition", productId, position, tag,
              error => {
                if (error) {
                  Logger.warn(error);
                  throw new Meteor.Error(403, error);
                }
              });
          });

        Tracker.flush();
      }
    });
  }
  // Start Tour for New Users Automatically
  const currentUser = Accounts.findOne(Meteor.userId());
  const myIntro = introJs().setOption("showProgress", true).setOption("showStepNumbers", false);
  if (Meteor.user().emails.length > 0 && !currentUser.takenTour) {
    myIntro.start();
    Accounts.update({_id: Meteor.userId()}, {$set: {takenTour: true}});
  }
});

Template.productGrid.events({
  "change [data-event-action=switchProductsView]": () => {
    const value = document.getElementById("switchProductView").value;
    if (value === "vendor") {
      Session.set("switchProducts", "vendor");
      document.getElementById("switchProductView").value = "vendor";
    } else if (value === "all") {
      Session.set("switchProducts", "all");
      document.getElementById("switchProductView").value = "all";
    }
  },
  "click [data-event-action=loadMoreProducts]": (event) => {
    event.preventDefault();
    loadMoreProducts();
  },
  "change input[name=selectProduct]": (event) => {
    let selectedProducts = Session.get("productGrid/selectedProducts");

    if (event.target.checked) {
      selectedProducts.push(event.target.value);
    } else {
      selectedProducts = _.without(selectedProducts, event.target.value);
    }

    Session.set("productGrid/selectedProducts", _.uniq(selectedProducts));

    const products = Template.currentData().products;

    if (products) {
      const filteredProducts = _.filter(products, (product) => {
        return _.includes(selectedProducts, product._id);
      });

      Reaction.showActionView({
        label: "Product Settings",
        i18nKeyLabel: "productDetailEdit.productSettings",
        template: "productSettings",
        type: "product",
        data: {
          products: filteredProducts
        }
      });
    }
  }
});

Template.productGrid.helpers({
  getTour1() {
    const steps = {
      eight: "Click on product to add to cart and order"
    };
    return steps;
  },
  loadMoreProducts() {
    return Template.instance().state.equals("canLoadMoreProducts", true);
  },
  products() {
    return Template.currentData().products;
  },
  isVendor() {
    return (Session.get("userType") !== "vendor");
  },
  showViewToggle() {
    const currUser = Accounts.findOne({
      userId: Meteor.userId()
    });
    const userType = currUser.userType;
    return (userType === "vendor");
  }
});
