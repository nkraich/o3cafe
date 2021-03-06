//---------------------------
//  Wall module for O3 Cafe
//  © 2015, Nicholas Kraich
//---------------------------

CafeWall = {
  menuItemName: "Wall",
  menuItemIcon: "bullhorn",
  menuItemRoutePath: "/wall",
  routeConfiguration: function(Router)
  {
    Router.route('/wall', function () {
      this.render('wall');
    });

    Router.route('/wall/archive', function () {
      this.render('wallArchive');
    });

    Router.route('/wall/import', function () {
      this.render('wallImport');
    });
  }
};

Posts = new Meteor.Collection("posts");

Meteor.startup(function ()
{
  WallPostsStore = new FS.Store.FileSystem("wallPostFileData", {path: "~/uploads"});
  //WallPostsStore = new FS.Store.GridFS("wallPostFileData");
  WallPostsFS = new FS.Collection("wallPosts", {
    stores: [WallPostsStore],
    filter: {
      maxSize: 2097152, //in bytes
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
      return (this.userId !== null);
    },

    update: function(userId, doc, fieldNames, modifier) {
      return (this.userId !== null);
    },

    remove: function(userId, doc) {
      return (this.userId !== null);
    },

    download: function(userId) {
      return true;
    }
  });

  Posts.allow({
    insert: function(userId, doc) {
      return (this.userId !== null);
    },

    update: function(userId, doc, fieldNames, modifier) {
      return doc.userId === userId && userId === this.userId;
    },

    remove: function(userId, doc) {
      return doc.userId === userId && userId === this.userId;
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

    if (Meteor.userId()) {
      newWallPost.createdAt = new Date();
      var id = Posts.insert(newWallPost);
      return id;
    }
    else {
      throw new Meteor.Error(413, "You must be logged in to post.");
      return null;
    }
  }
});
