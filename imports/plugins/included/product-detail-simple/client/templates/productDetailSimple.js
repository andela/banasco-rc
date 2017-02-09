/* eslint-disable max-len*/
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
  testDisplay() {
    const config = Template.instance().state.get("feed");
    const checkFacebook = config.facebook.enabled;
    const checkTwitter = config.twitter.enabled;
    if (checkFacebook && checkTwitter) {
      return {disqus: "col-sm-4", facebook: "col-sm-4", twitter: "col-sm-4"};
    } else if (checkFacebook && !checkTwitter) {
      return {disqus: "col-sm-8", facebook: "col-sm-4", twitter: ""};
    } else if (!checkFacebook && checkTwitter) {
      return {disqus: "col-sm-8", facebook: "", twitter: "col-sm-4"};
    }
    return {disqus: "col-sm-12", facebook: "", twitter: ""};
  },

  addDisqusThread() {
    const threads = document.createElement("script");
    threads.src = "//banasko-rc.disqus.com/embed.js";
    threads.setAttribute("data-timestamp", + new Date());
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
    if (facebookConfig.enabled && facebookConfig.appId &&
    facebookConfig.profilePage) {
      const baseUrl = "https://www.facebook.com/plugins/page.php?";
      const href = `href=${facebookConfig.profilePage}`;
      const dimensions = "&tabs=timeline&width=400&height=400&";
      const sHeader = "small_header=false&adapt_container_width=true";
      const remainder = "&hide_cover=false&show_facepile=false&";
      const appID = `appId=${facebookConfig.appId}`;
      url = `${baseUrl}${href}${dimensions}${sHeader}${remainder}${appID}`;
      return url;
    }
    return false;
  }

});
