//-------------
//  Interface
//-------------

Template.profile.created = function() {
  this.lastFocusedProfileField = 'username';
};

Template.profile.rendered = function() {
  Session.set('showDeleteAccountConfirmation', false);
  $('#username').focus();
};

//------------------
//  Data Providers
//------------------

Template.profile.helpers({
  showDeleteAccountConfirmation: function () {
    return Session.get('showDeleteAccountConfirmation');
  }
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
    e.preventDefault();

    username = tmpl.find('#username').value;
    emailAddress = tmpl.find('#email').value;

    // Trim
    if (username) { username = username.trim(); }
    if (emailAddress) { emailAddress = emailAddress.trim(); }

    if (!username || username === '') {
      Notifications.showError("You must provide a username.");
      return;
    }

    $('#saveProfileButton').prop("disabled", true);

    // Call the update method.
    Meteor.users.update(
      { _id: Meteor.userId() },
      {
        $set: {
          username: username,
          emails: [{address: emailAddress, verified: false}]
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

  'click #deleteAccountButton' : function(e, tmpl) {
    e.preventDefault();
    Session.set('showDeleteAccountConfirmation', true);
    _disableProfileEditForm();
  },

  // This starts the deletion process by popping open a confirmation
  // control panel.  The user can still cancel after this method is called.
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
  }
};

//-----------
//  Helpers
//-----------

_enableProfileEditForm = function(tmpl) {
  $('#username').prop("disabled", false);
  $('#email').prop("disabled", false);
  $('#saveProfileButton').prop("disabled", false);
  _focusOnProfileEditForm(tmpl);
};

_disableProfileEditForm = function(tmpl) {
  $('#username').prop("disabled", true);
  $('#email').prop("disabled", true);
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
