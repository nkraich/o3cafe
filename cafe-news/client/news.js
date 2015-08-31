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

//-----------
//  Helpers
//-----------

Template.newsPost.helpers({
  usernameFromId: function(userId) {
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
  },

  imageStyle: function(style) {
    var newsPost = Template.currentData();

    if (!newsPost || !newsPost.image || !newsPost.image.id || !newsPost.image.orientation) {
      return style === 'none';
    }
    else {
      return (style === newsPost.image.orientation);
    }

  }
});

//----------
//  Events
//----------

Template.news.events = {
  'click .create-button': function(event, template) {
    Router.go('/news/edit');
  }
};

Template.newsPost.events = {
  'click .edit-button': function(event, template) {
    var newsPost, index;
    newsPost = $(event.currentTarget).parents('.news-post');
    id = $(newsPost).attr('data-id');
    Router.go('/news/edit/' + id);
  },

  'click .delete-button': function(event, template) {
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
