import { Session } from "meteor/session";
import { Template } from "meteor/templating";
import { ReactiveDict } from "meteor/reactive-dict";
import { IconButton } from "/imports/plugins/core/ui/client/components";

Template.gridControls.onCreated(function () {
  this.state = new ReactiveDict();

  this.autorun(() => {
    const selectedProducts = Session.get("productGrid/selectedProducts");
    const isSelected = _.isArray(selectedProducts) ? selectedProducts.indexOf(this.data.product._id) >= 0 : false;

    this.state.set("isSelected", isSelected);
  });
});

Template.gridControls.onRendered(function () {
  return this.$("[data-toggle='tooltip']").tooltip({
    position: "top"
  });
});

Template.gridControls.helpers({
  getTour3() {
    const steps = {
      eight: "Make your product visible by clicking here",
      nine: "You can edit your product by clicking here"
    };
    return steps;
  },
  EditButton() {
    const instance = Template.instance();
    const isSelected = instance.state.equals("isSelected", true);

    return {
      component: IconButton,
      icon: "fa fa-pencil",
      onIcon: "fa fa-check",
      status: isSelected ? "active" : "default",
      toggle: true,
      toggleOn: isSelected,
      onClick() {
        if (instance.data.onEditButtonClick) {
          instance.data.onEditButtonClick();
        }
      }
    };
  },

  VisibilityButton() {
    const instance = Template.instance();

    return {
      component: IconButton,
      icon: "fa fa-eye-slash",
      onIcon: "fa fa-eye",
      toggle: true,
      toggleOn: instance.data.product.isVisible,
      onClick() {
        if (instance.data.onPublishButtonClick) {
          instance.data.onPublishButtonClick();
        }
      }
    };
  },

  checked: function () {
    return Template.instance().state.equals("isSelected", true);
  }
});
