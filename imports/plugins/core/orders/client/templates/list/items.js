import { Template } from "meteor/templating";
import Alert from "sweetalert2";
import { Media } from "/lib/collections";
import { NumericInput } from "/imports/plugins/core/ui/client/components";

/**
 * ordersListItems helpers
 *
 */
Template.ordersListItems.helpers({
  orderCancel() {
    let orderCancellation = true;
    const { order } = Template.instance().data;
    if (order.workflow.status === "coreOrderWorkflow/canceled" || order.workflow.status === "coreOrderWorkflow/completed") {
      orderCancellation = false;
    }
    return orderCancellation;
  },
  media() {
    const variantImage = Media.findOne({
      "metadata.productId": this.productId,
      "metadata.variantId": this.variants._id
    });
    // variant image
    if (variantImage) {
      return variantImage;
    }
    // find a default image
    const productImage = Media.findOne({
      "metadata.productId": this.productId
    });
    if (productImage) {
      return productImage;
    }
    return false;
  },
  items() {
    const { order } = Template.instance().data;
    const combinedItems = [];
    if (order) {
      // Lopp through all items in the order. The items are split into indivital items
      for (const orderItem of order.items) {
        // Find an exising item in the combinedItems array
        const foundItem = combinedItems.find((combinedItem) => {
          // If and item variant exists, then we return true
          if (combinedItem.variants) {
            return combinedItem.variants._id === orderItem.variants._id;
          }
          return false;
        });
        // Increment the quantity count for the duplicate product variants
        if (foundItem) {
          foundItem.quantity++;
        } else {
          // Otherwise push the unique item into the combinedItems array
          combinedItems.push(orderItem);
        }
      }
      return combinedItems;
    }
    return false;
  },

  numericInputProps(value) {
    const { currencyFormat } = Template.instance().data;
    return {
      component: NumericInput,
      value,
      format: currencyFormat,
      isEditing: false
    };
  }
});

Template.ordersListItems.events({
  "click [data-event-action=orderCancellation]"(event) {
    event.preventDefault();
    const instance = Template.instance().data;
    const order = instance.order;
    if (order.workflow.status === "new" || order.workflow.status === "coreOrderWorkflow/processing") {
      Alert({
        title: "Are you sure you want to cancel this order?",
        text: "You won't be able to reverse this!",
        type: "warning",
        showConfirmButton: true,
        cancelButtonText: "Dismiss",
        showCancelButton: true
      }).then(() => {
        Meteor.call("workflow/pushOrderWorkflow", "coreOrderWorkflow", "canceled", order);
        order.workflow.status = "coreOrderWorkflow/canceled";
      })
       .catch(Alert.noop);
    }
  }
});
