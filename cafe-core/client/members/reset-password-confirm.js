//-------------
//  Interface
//-------------

Template.resetPasswordConfirm.rendered = function() {
  $('#newPassword').focus();
};

//----------
//  Events
//----------

Template.resetPasswordConfirm.events = {
  'click #resetPasswordButton' : function(e, tmpl) {
    var newPassword, token;

    e.preventDefault();

    newPassword = tmpl.find('#newPassword').value;
    token = Session.get('resetPasswordToken');

    $('#resetPasswordButton').prop("disabled", true);

    // Call the password reset method.
    Accounts.resetPassword(token, newPassword, function(error) {
      if (error) {
        if (error.error === 403) {
          Notifications.showError("The password reset token has expired.  Please <a href=\"/reset-password\">request a new one</a>.");
        }
        else if (error.error === 400) {
          Notifications.showError("The password may not be empty.");
        }
        else {
          Notifications.showError(error);
        }
        $('#resetPasswordButton').prop("disabled", false);
      }
      else {
        Router.go('/');
        Notifications.showSuccess("Your password has been reset.");
        Session.set('resetPasswordToken', null);
      }
    });
  }
};
