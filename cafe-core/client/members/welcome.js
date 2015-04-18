//------------------
//  Data Providers
//------------------

Template.welcome.helpers({
  username: function () {
    return Meteor.user() ? Meteor.user().username : null;
  }
});

