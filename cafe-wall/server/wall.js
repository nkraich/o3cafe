//--------------------
//  Server interface
//--------------------

Meteor.startup(function ()
{
  console.log("Initializing wall.");

  Meteor.publish('wall', function()
  {
    return [
      WallPostsFS.find({}, {
        sort: {
          "copies.wallPostFileData.updatedAt": -1,
          "copies.wallPostFileData.utime": -1
        }
      }),
      Posts.find({}, {
        sort: {"createdAt": -1}
      })
    ];
  });
});
