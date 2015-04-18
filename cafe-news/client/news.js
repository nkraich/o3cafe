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

/*Template.wallPosts.helpers({
  newsPosts: function() {
    return Posts.find({}, {
      sort: {"createdAt": -1},
      limit: 25 
    });
  }
});*/

//----------
//  Events
//----------

/*Template.uploader.events = {
  'click #pendingDeleteButton': function(event, template) {
    Session.set('wallFile', null);
  }
};*/
