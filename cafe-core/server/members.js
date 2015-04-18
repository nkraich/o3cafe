//----------------
//  Email config
//----------------

process.env.MAIL_URL = "smtp://postmaster@o3software.com:fb7f2b1df5ac80068eee95f403b9a18a@smtp.mailgun.org/";
Accounts.emailTemplates.from = "admin@o3software.com";
Accounts.emailTemplates.siteName = "O3 Cafe";
Accounts.emailTemplates.resetPassword = {
  subject: function(user) {
    return "O3 Cafe password reset"
  },
  text: function(user, url) {
    url = url.replace('#/', '');
    return user.username + ",\n\nSomebody has requested a password change for your account on O3 Cafe.\n\nIf this was you, please visit the following URL to reset your password:\n\n" + url;
  }
};

//-------------
//  Interface
//-------------

Meteor.methods(
{
  sendResetPasswordEmail: function(emailAddress)
  {
    user = Meteor.users.findOne({emails: {$elemMatch: {address: emailAddress}}});

    if (user) {
      Accounts.sendResetPasswordEmail(user._id, emailAddress);
      return true;
    }
    else {
      return false;
    }
  }
});
