//-------------
//  Interface
//-------------

isCommand = function(message) {
  return (message.message.substring(0,1) === '/');
};

runCommand = function (message)
{
  var string = message.message;
  var splitString = message.message.split(' ');

  if (splitString[0] === "/me") {
    message.message = string.substring(3, string.length).trim();
    message.action = true;
    return false;
  }

  // Change vanity name.
  if (splitString[0] === "/nick") {
    Meteor.users.update(
      { _id: Meteor.userId() },
      {
        $set: {
          profile: {
            vanityName: string.substring(5, string.length).trim()
          }
        }
      }
    );
    return true;
  }

  var isSuperAdmin = Meteor.user().username === 'puffin';
  var isAdmin = Meteor.user().admin;

  if (isAdmin && message.message === "/clear") {
    _clearChat();
    return true;
  }
  if (isSuperAdmin && message.message === "/initdb") {
    Meteor.call('initializeDatabase');
    return true;
  }
  if (isSuperAdmin && message.message === "/initq") {
    Meteor.call('initializeQuestions');
    return true;
  }
  if (isSuperAdmin && message.message === "/adminpls") {
    Meteor.users.update(
      { _id: Meteor.userId() },
      {
        $set: { admin: !Meteor.user().admin }
      }
    );
    return true;
  }
};

//-----------
//  Private
//-----------

_clearChat = function() {
  Messages.remove({});
};
