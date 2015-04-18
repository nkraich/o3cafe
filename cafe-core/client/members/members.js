//------------------
//  Data providers
//------------------

Template.members.helpers({
  members: function() {
    return Meteor.users.find({}, {sort: {'status.lastLogin': -1}});
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

Template.members.events({
  'click .make-admin-button' : function(e, tmpl) {
    var userId = $(e.currentTarget).attr('data-id');
    e.stopPropagation();

    // Call the update method.
    Meteor.users.update(
      { _id: userId },
      {
        $set: {
          admin: true
        }
      },
      function(error)
      {
        if (error) {
          Notifications.showError(error);
        }
      }
    );
  },

  'click .remove-admin-button' : function(e, tmpl) {
    var userId = $(e.currentTarget).attr('data-id');
    e.stopPropagation();

    // Call the update method.
    Meteor.users.update(
      { _id: userId },
      {
        $set: {
          admin: false
        }
      },
      function(error)
      {
        if (error) {
          Notifications.showError(error);
        }
      }
    );
  }
});
