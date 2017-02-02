import { ProductDetailContainer } from "../containers";
import { isRevisionControlEnabled } from "/imports/plugins/core/revisions/lib/api";
import { Template } from "meteor/templating";
import { Packages } from "/lib/collections";
import { ReactiveDict } from "meteor/reactive-dict";

Template.productDetailSimple.helpers({
  isEnabled() {
    return isRevisionControlEnabled();
  },
  PDC() {
    return ProductDetailContainer;
  }
});

Template.embedSocial.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.setDefault({
    feed: {}
  });

  this.autorun(() => {
    this.subscribe("Packages");
    const socialConfig = Packages.findOne({
      name: "reaction-social"
    });
    this.state.set("feed", socialConfig.settings.public.apps);
  });
});

Template.embedSocial.helpers({
  addDisqusThread() {
    const threads = document.createElement("script");
    threads.src = "//banasko-rc.disqus.com/embed.js";
    threads.setAttribute("data-timestamp", +new Date());
    (document.head || document.body).appendChild(threads);
  },
  twitter() {
    const twitterConfig = Template.instance().state.get("feed").twitter;
    if (twitterConfig.enabled && twitterConfig.profilePage) {
      return twitterConfig.profilePage;
    }
    return false;
  },
  facebook() {
    const facebookConfig = Template.instance().state.get("feed").facebook;
    if (facebookConfig.enabled && facebookConfig.appId && facebookConfig.profilePage) {
      return `https://www.facebook.com/plugins/page.php?href=${facebookConfig.profilePage}&tabs=timeline&width=400&height=400&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false&appId=${facebookConfig.appId}`;
    }
    return false;
  }

});
