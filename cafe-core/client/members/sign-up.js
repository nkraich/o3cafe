//-------------
//  Interface
//-------------

Template.signUp.rendered = function() {
  $('#username').focus();
};

//----------
//  Events
//----------

Template.signUp.events = {
  'click #signUpButton' : function(e, tmpl) {
    var login, password;

    e.preventDefault();

    username = tmpl.find('#username').value;
    email = tmpl.find('#email').value;
    password = tmpl.find('#password').value;

    // Trim
    if (username) { username = username.trim(); }
    if (email) { email = email.trim(); }

    if (!username || username === '') {
      Notifications.showError("You must provide a username.");
      return;
    }

    $('#signUpButton').prop("disabled", true);

    Accounts.createUser(
      { username: username, email: email, password: password },
      function(error)
      {
        if (error) {
          if (error.error === 400) {
            Notifications.showError("You must enter a password.");
          }
          // Messy conversions by checking the reason field.
          // This is necessary because the following two errors share the same
          // error code of 403.  Not sure why, but this seems to be the only
          // way to distinguish them.
          else if (error.reason === "Username already exists.") {
            Notifications.showError("Sorry, this username is taken.");
          }
          else if (error.reason === "Email already exists.") {
            Notifications.showError("Sorry, this email address is already being used.");
          }
          else {
            Notifications.showError(error);
          }
          $('#signUpButton').prop("disabled", false);
        }
        else {
          Router.go('/welcome');
        }
      }
    );
  }
};
