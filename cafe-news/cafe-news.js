//---------------------------
//  News module for O3 Cafe
//  © 2015, Nicholas Kraich
//---------------------------

NewsPosts = new Meteor.Collection("newsPosts");

CafeNews = {
  menuItemName: "News",
  menuItemIcon: "globe",
  menuItemRoutePath: "/news",
  routeConfiguration: function(Router)
  {
    Router.route('/news', function () {
      this.render('news');
    });

    Router.route('/news/edit', function () {
      this.render('editNews');
    });

    Router.route('/news/edit/:_id', {
      //loadingTemplate: 'loading',

      waitOn: function () {
        // return one handle, a function, or an array
        return Meteor.subscribe('news', this.params._id);
      },

      action: function () {
        var newsPost = NewsPosts.findOne({_id: this.params._id});
        this.render('editNews', {data: newsPost});
      }
    });
  }
};

Meteor.startup(function ()
{
  NewsPosts.allow({
    insert: function(userId, doc) {
      return true;
      //return userId && userId === Meteor.userId();
    },

    update: function(userId, doc, fieldNames, modifier) {
      return true;
      //return doc.userId === userId && userId === Meteor.userId();
    },

    remove: function(userId, doc) {
      return true;
      //return doc.userId === userId && userId === Meteor.userId();
    }
  });
});

/*Meteor.methods(
{
});*/
