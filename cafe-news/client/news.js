//--------------------
//  Client interface
//--------------------

Meteor.startup(function ()
{
  console.log("Initializing news.");
  Meteor.subscribe("news");
});

//------------------
//  Data providers
//------------------

Template.news.helpers({
  newsPosts: function() {
    return NewsPosts.find({}, {
      sort: {"createdAt": -1},
      limit: 10
    });
  }
});

Template.newsPost.helpers({
  getUsername: function(userId) {
    var user = Meteor.users.findOne({_id: userId});
    if (user && user.username) {
      return user.username;
    }
    else {
      return null;
    }
  },

  formatDate: function(date) {
    if (date) {
      return moment(date).calendar();
    }
    else {
      return "";
    }
  }
});

//----------
//  Events
//----------

Template.newsPost.events = {
  'click .edit-link': function(event, template) {
    var newsPost, index;
    newsPost = $(event.currentTarget).parents('.news-post');
    id = $(newsPost).attr('data-id');
    alert("TODO: Edit");
  },

  'click .delete-link': function(event, template) {
    var newsPost, index;
    newsPost = $(event.currentTarget).parents('.news-post');
    id = $(newsPost).attr('data-id');
    NewsPosts.remove({_id: id}, function(error) {
      if (error) {
        Notifications.showError(error);
      }
    });
  }
};
