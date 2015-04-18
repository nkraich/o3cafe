//---------------------------
//  Wall module for O3 Cafe
//  © 2015, Nicholas Kraich
//---------------------------

CafeWall = {
  menuItemName: "Wall",
  menuItemIcon: "bullhorn",
  menuItemRoutePath: "/wall"
};

Posts = new Meteor.Collection("posts");

Meteor.startup(function ()
{
  WallPostsStore = new FS.Store.GridFS("wallPostFileData");
  WallPostsFS = new FS.Collection("wallPosts", {
    stores: [WallPostsStore],
    filter: {
      maxSize: 1048576, //in bytes
      allow: {
        contentTypes: ['image/*'],
        extensions: ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG', 'gif', 'GIF']
      },
      onInvalid: function (message) {
        alert(message);
      }
    }
  });

  WallPostsFS.allow({
    insert: function(userId, doc) {
      return true;
    },

    update: function(userId, doc, fieldNames, modifier) {
      return true;
      //return doc.userId === userId && userId === Meteor.userId();
    },

    remove: function(userId, doc) {
      return true;
      //return doc.userId === userId && userId === Meteor.userId();
    },

    download: function(userId) {
      return true;
    }
  });

  Posts.allow({
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

Meteor.methods(
{
  addWallPost: function(newWallPost)
  {
    /*if (newWallPost.message === '') {
      throw new Meteor.Error(413, "Please enter a message to post.");
    }*/

    newWallPost.createdAt = new Date();
    var id = Posts.insert(newWallPost);
    
    return id;
  }
});
