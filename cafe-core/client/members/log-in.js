//-------------
//  Interface
//-------------

Template.logIn.rendered = function() {
  $('#login').focus();
};

//----------
//  Events
//----------

Template.logIn.events = {
  'click #logInButton' : function(e, tmpl) {
    var login, password;

    e.preventDefault();

    login = tmpl.find('#login').value;
    password = tmpl.find('#password').value;

    $('#logInButton').prop("disabled", true);

    Meteor.loginWithPassword(login, password, function(error) {
      if (error) {
        if (error.error === 400) {
          Notifications.showError("Please enter your username.");
        }
        else if (error.error === 403) {
          Notifications.showError("Your username or password was incorrect.");
        }
        else {
          Notifications.showError(error);
        }
        $('#logInButton').prop("disabled", false);
      }
      else {
        Notifications.clear();
        Router.go('/');
      }
    });
  }
};
