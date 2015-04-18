//-------------
//  Interface
//-------------

Template.resetPasswordRequest.rendered = function() {
  $('#email').focus();
};

//----------
//  Events
//----------

Template.resetPasswordRequest.events = {
  'click #resetPasswordButton' : function(e, tmpl) {
    e.preventDefault();

    $('#resetPasswordButton').prop("disabled", true);

    emailAddress = tmpl.find('#email').value;
    Meteor.call('sendResetPasswordEmail', emailAddress, function(error, result) {
      if (result === true) {
        Notifications.showSuccess("A password reset email has been sent to your address.");
        Router.go('/reset-password/wait');
      }
      else {
        Notifications.showError("Sorry, no user with this email address was found.");
        $('#resetPasswordButton').prop("disabled", false);
      }
    });
  }
};
