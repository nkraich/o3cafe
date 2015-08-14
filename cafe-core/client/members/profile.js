//-------------
//  Interface
//-------------

Template.profile.created = function() {
  Session.set('notificationsPermissionLevel', notify.permissionLevel());
  this.lastFocusedProfileField = 'username';
};

Template.profile.rendered = function() {
  Session.set('showDeleteAccountConfirmation', false);
  $('#username').focus();
};

Template.deleteAccountConfirmation.rendered = function() {
  $('#leftPanel').scrollTop($('#leftPanel')[0].scrollHeight);
  $('#password').focus();
};

//------------------
//  Data Providers
//------------------

Template.profile.helpers({
  showDeleteAccountConfirmation: function () {
    return Session.get('showDeleteAccountConfirmation');
  },

  notificationsPermissionLevel: function() {
    return Session.get('notificationsPermissionLevel');
  },

  notificationsPermissionDefault: function() {
    return Session.get('notificationsPermissionLevel') === 'default';
  },

  notificationsPermissionGranted: function() {
    return Session.get('notificationsPermissionLevel') === 'granted';
  },

  notificationsPermissionDenied: function() {
    return Session.get('notificationsPermissionLevel') === 'denied';
  },
});

//----------
//  Events
//----------

Template.profile.events =
{
  'focus #username': function(e, tmpl) {
    tmpl.lastFocusedProfileField = 'username';
  },

  'focus #email': function(e, tmpl) {
    tmpl.lastFocusedProfileField = 'email';
  },

  'click #saveProfileButton' : function(e, tmpl) {
    var username, vanityName, email, firstName, lastName;

    e.preventDefault();

    // Set values.
    username = tmpl.find('#username').value;
    vanityName = tmpl.find('#vanityName').value;
    email = tmpl.find('#email').value;
    firstName = tmpl.find('#firstName').value;
    lastName = tmpl.find('#lastName').value;

    // Trim.
    if (username) { username = username.trim(); }
    if (vanityName) { vanityName = vanityName.trim(); }
    if (email) { email = email.trim(); }
    if (firstName) { firstName = firstName.trim(); }
    if (lastName) { lastName = lastName.trim(); }

    // Required fields
    if (!username || username === '') {
      Notifications.showError("You must provide a username.");
      return;
    }

    // Disable the save button.
    $('#saveProfileButton').prop("disabled", true);

    // Call the update method.
    Meteor.users.update(
      { _id: Meteor.userId() },
      {
        $set: {
          username: username,
          emails: [{address: email, verified: false}],
          profile: {
            vanityName: vanityName,
            firstName: firstName,
            lastName: lastName
          }
        }
      },
      function(error)
      {
        if (error) {
          if (error.error === 409) {
            Notifications.showError("The username or email address is taken.");
          }
          else {
            Notifications.showError(error);
          }
        }
        else {
          Notifications.showSuccess("Your profile has been updated.");
        }
        $('#saveProfileButton').prop("disabled", false);
      }
    );
  },

  'click #changePasswordButton' : function(e, tmpl) {
    e.preventDefault();
    Router.go('/change-password');
  },

  // This starts the deletion process by popping open a confirmation
  // control panel.  The user can still cancel after this method is called.
  'click #deleteAccountButton' : function(e, tmpl) {
    e.preventDefault();
    Session.set('showDeleteAccountConfirmation', true);
    _disableProfileEditForm();
  },

  'click #cancelDeleteAccountButton' : function(e, tmpl) {
    e.preventDefault();
    Session.set('showDeleteAccountConfirmation', false);
    _enableProfileEditForm(tmpl);
  },

  // This will actually delete the account if the provided password is correct.
  'click #deleteAccountConfirmationButton' : function(e, tmpl) {
    e.preventDefault();

    _disableDeleteAccountForm();

    // Call the login method to verify that the user's password is correct.
    // If it is, then delete the account.
    password = tmpl.find('#password').value;
    Meteor.loginWithPassword(Meteor.user().username, password, function(error) {
      if (error) {
        if (error.error === 403) {
          Notifications.showError("Your password was incorrect.");
        }
        else {
          Notifications.showError(error);
        }
        _enableDeleteAccountForm(tmpl);
      }
      else {
        Meteor.users.remove({_id: Meteor.userId()}, function() {
          Meteor.logout();
          Router.go('/account-deleted');
          Notifications.showSuccess("Your account has been deleted.");
        });
      }
    });
  },

  'click #requestNotificationPermissionButton' : function(e, tmpl) {
    e.preventDefault();
    notify.requestPermission(function() {
      Session.set('notificationsPermissionLevel', notify.permissionLevel());
    });
    Meteor.users.update(
      { _id: Meteor.userId() },
      {
        $set: {
          profile: {
            notifications: true
          }
        }
      },
      function(error)
      {
      }
    );
  },

  'change #enableNotificationsCheckbox' : function(e, tmpl) {
    var value = $('#enableNotificationsCheckbox').prop("checked");
    Meteor.users.update(
      { _id: Meteor.userId() },
      {
        $set: {
          profile: {
            notifications: value
          }
        }
      },
      function(error)
      {
      }
    );
  }
};

//-----------
//  Helpers
//-----------

_enableProfileEditForm = function(tmpl) {
  $('#username').prop("disabled", false);
  $('#vanityName').prop("disabled", false);
  $('#email').prop("disabled", false);
  $('#firstName').prop("disabled", false);
  $('#lastName').prop("disabled", false);
  $('#saveProfileButton').prop("disabled", false);
  _focusOnProfileEditForm(tmpl);
};

_disableProfileEditForm = function(tmpl) {
  $('#username').prop("disabled", true);
  $('#vanityName').prop("disabled", true);
  $('#email').prop("disabled", true);
  $('#firstName').prop("disabled", true);
  $('#lastName').prop("disabled", true);
  $('#saveProfileButton').prop("disabled", true);
};

_focusOnProfileEditForm = function(tmpl) {
  $('#' + tmpl.lastFocusedProfileField).focus();
}

_enableDeleteAccountForm = function(tmpl) {
  $('#password').prop("disabled", false);
  $('#cancelDeleteAccountButton').prop("disabled", false);
  $('#deleteAccountConfirmationButton').prop("disabled", false);
  _focusOnDeleteAccountForm(tmpl);
};

_disableDeleteAccountForm = function(tmpl) {
  $('#password').prop("disabled", true);
  $('#cancelDeleteAccountButton').prop("disabled", true);
  $('#deleteAccountConfirmationButton').prop("disabled", true);
};

_focusOnDeleteAccountForm = function(tmpl) {
  $('#password').focus();
}
