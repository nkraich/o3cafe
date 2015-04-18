//--------------------
//  Server interface
//--------------------

Meteor.startup(function ()
{
  console.log("Initializing news.");

  Meteor.publish('news', function()
  {
    return [
      NewsPosts.find({}, {
        sort: {"createdAt": -1}
      })
    ];
  });
});
