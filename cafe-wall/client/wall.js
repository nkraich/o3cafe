//--------------------
//  Client interface
//--------------------

Meteor.startup(function ()
{
  console.log("Initializing wall.");
  Meteor.subscribe("wall");
});

//------------------
//  Data providers
//------------------

Template.wall.helpers({
  images: function() {
    return WallPostsFS.find({"copies.wallPostFileData.utime":{$exists: true}}, {
      sort: {"copies.wallPostFileData.updatedAt": -1, "copies.wallPostFileData.utime": -1},
      limit: 25 
    });
  }
});

Template.wallPosts.helpers({
  posts: function() {
    return Posts.find({}, {
      sort: {"createdAt": -1},
      limit: 25 
    });
  }
});

Template.wallArchive.helpers({
  allImages: function() {
    return WallPostsFS.find({"copies.wallPostFileData.utime":{$exists: true}}, {
      sort: {"copies.wallPostFileData.updatedAt": -1, "copies.wallPostFileData.utime": -1}
    });
  }
});

Template.wallPostsArchive.helpers({
  allPosts: function() {
    return Posts.find({}, {
      sort: {"createdAt": -1}
    });
  }
});

Template.uploader.helpers({
  isFilePending: function() {
    return (Session.get('wallFile') !== null);
  },

  pendingFileUrl: function() {
    var image = WallPostsFS.findOne({_id:Session.get('wallFile')});
    if (image) {
      return image.url();
    }
    else {
      return null;
    }
  }
});

//--------------
//  UI Helpers
//--------------

Handlebars.registerHelper('getPictureUrl', function(fileId) {
  var image = WallPostsFS.findOne({_id:fileId});
  if (image) {
    return image.url();
  }
  else {
    return null;
  }
});

Handlebars.registerHelper('getUsername', function(userId) {
  var user = Meteor.users.findOne({_id: userId});
  return user ? user.username : '';
});

//----------
//  Events
//----------

Template.uploader.events = {
  'change #fileInput2': function(event, template) {
    console.log('File selected.');
    FS.Utility.eachFile(event, function(file) {
      file.userId = Meteor.userId();
      var image = WallPostsFS.insert(file, function (error, fileObj) {
        if (error) {
          console.log(error);
        }
        else {
          Session.set('wallFile', image._id);
        }
      });
    });
  },

  /*'click #dateUpdater': function(event, template) {
    console.log('Updating post dates.');
    Meteor.call('updatePostDates');
  },*/

  'click #pendingDeleteButton': function(event, template) {
    Session.set('wallFile', null);
  },

  'click #postButton' : function(e, tmpl) {
    e.preventDefault();

    var body = tmpl.find("#wallPostTextArea").value
    if (body === "" && !Session.get('wallFile')) {
      Notifications.showError("Please enter text or provide an image.");
      return;
    }

    var newWallPost = {
      body: body
    };

    //newWallPost.username = Meteor.user().username;
    newWallPost.userId = Meteor.userId();

    if (Session.get('wallFile')) {
      var id = Session.get('wallFile');
      newWallPost.attachedFileId = id;
      Session.set('wallFile', null);
    }

    // Clear out the old message
    tmpl.find("#wallPostTextArea").value = "";

    Meteor.call(
      "addWallPost",
      newWallPost,
      function (error, result) {
        if (error) {
          Notifications.showError(error.reason);
        }
      }
    );
  }
};
