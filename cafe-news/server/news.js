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
        fields: {'userId': 1, 'createdAt': 1, 'title': 1},
        sort: {'createdAt': -1}
      })
    ];
  });
});
