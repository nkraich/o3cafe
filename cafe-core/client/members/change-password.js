//-------------
//  Interface
//-------------

Template.changePassword.rendered = function() {
  $('#oldPassword').focus();
};

//----------
//  Events
//----------

Template.changePassword.events = {
  'click #changePasswordButton' : function(e, tmpl) {
    var oldPassword, newPassword;

    e.preventDefault();

    oldPassword = tmpl.find('#oldPassword').value;
    newPassword = tmpl.find('#newPassword').value;

    $('#changePasswordButton').prop("disabled", true);

    // Call the change password method.
    Accounts.changePassword(oldPassword, newPassword, function(error) {
      if (error) {
        if (error.error === 400) {
          Notifications.showError("Please enter your old password and a new password.");
        }
        else if (error.error === 403) {
          Notifications.showError("Your old password was entered incorrectly.");
        }
        else {
          Notifications.showError(error);
        }
        $('#changePasswordButton').prop("disabled", false);
      }
      else {
        Router.go('/');
        Notifications.showSuccess("Your password has been changed.");
      }
    });
  }
};
