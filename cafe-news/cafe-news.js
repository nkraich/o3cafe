//---------------------------
//  News module for O3 Cafe
//  © 2015, Nicholas Kraich
//---------------------------

CafeNews = {
  menuItemName: "News",
  menuItemIcon: "globe",
  menuItemRoutePath: "/news",
  routeConfiguration: function(Router) {
    Router.route('/news', function () {
      this.render('news');
    });
  }
};

NewsPosts = new Meteor.Collection("newsPosts");

Meteor.startup(function ()
{
  NewsPosts.allow({
    insert: function(userId, doc) {
      return userId && userId === Meteor.userId();
    },

    update: function(userId, doc, fieldNames, modifier) {
      return doc.userId === userId && userId === Meteor.userId();
    },

    remove: function(userId, doc) {
      return doc.userId === userId && userId === Meteor.userId();
    }
  });
});

/*Meteor.methods(
{
});*/
