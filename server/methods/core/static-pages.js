import { Meteor } from "meteor/meteor";
import { Reaction } from "/server/api";
import { check } from "meteor/check";
import { StaticPages } from "/lib/collections";
import * as Schemas from "/lib/collections/schemas";

/**
 * Static Pages Methods
 */
Meteor.methods({
 /**
  * pages/createPage
  * @param {Object} pageDetails - page details
  * @return {Object} page - new page object
  */
  "pages/createPage": function (pageDetails) {
    if (!Object.keys(pageDetails).length) return Meteor.error("error", "Cannot create empty page");

    check(pageDetails.shopId, String);
    check(pageDetails.pageTitle, String);
    check(pageDetails.content, String);
    check(pageDetails.slug, String);
    check(pageDetails.createdby, String);

    if (!Reaction.hasAdminAccess()) {
      throw new Meteor.Error(403, "Access denied");
    }

    this.unblock();

    if (StaticPages.find({ slug: slug }).count()) {
      throw new Meteor.error("error", "This page already exists");
    }

    check(pageDetails, Schemas.StaticPages);
    return StaticPages.insert(pageDetails);
  },

  /**
   * pages/getAllPages
   * @return {Object} pages - Array of page objects
   */
  "pages/getAllPages": function () {
    const data = {};
    const pages = StaticPages.findAll({ shopId: Reaction.getShopId() });

    if (!pages.length) {
      data.message = "No pages created yet!";
      data.pages = null;
    } else {
      data.message = `${pages.length} pages active`;
      data.pages = pages;
    }

    return data;
  },

  /**
   * pages/getSinglePage
   * @param {String} pageId
   * @return {Object} page
   */
  "pages/getSinglePage": function (pageId) {
    check(pageId, String);
    this.unblock();

    const page = StaticPages.findOne({ _id: pageId });
    if (!page.count()) return Meteor.error(404, "Page not found");
    return page;
  },

  /**
   * pages/update
   * @param {Object} updateFields - fields to be updated
   * @param {String} pageId - fields to be updated
   * @return {Object} updatedPage
   */
  "pages/update": function (updateFields, pageId) {
    check(updateFields, Schemas.StaticPages);
    check(pageId, String);

    this.unblock();
    const updatedPage = StaticPages.update(
      { _id: pageId },
      { $set: {
        pageTitle: updateFields.pageTitle,
        content: updateFields.content,
        updatedAt: new Date
      }
      }
    );
    if (!updatedPage) return Meteor.error(404, "Unable to update this document.");
    return updatedPage;
  },

  /**
   * pages/delete
   * @param {String} pageId - page id
   * @return {Null} - no return value
   */
  "pages/delete": function (pageId) {
    check(pageId, String);

    this.unblock();
    if (StaticPages.deleteOne({ _id: pageId })) {
      return Alerts.toast("Page successfully deleted");
    }
    return Alerts.toast("Unable to delete page", "error");
  }
});
