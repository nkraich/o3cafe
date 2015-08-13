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

  var isAdmin = message.username === "puffin"
             || message.username === "nim"
             || message.username === "BenH"
             || message.username === "DaveJ";

  if (isAdmin && message.message === "/start") {
    Meteor.call('startTrivia', 73);
    return true;
  }
  if (isAdmin && message.message === "/next") {
    Meteor.call('nextQuestion');
    return true;
  }
  if (isAdmin && message.message === "/start 70") {
    Meteor.call('startTrivia', 70);
    return true;
  }
  if (isAdmin && message.message === "/start 60") {
    Meteor.call('startTrivia', 60);
    return true;
  }
  if (isAdmin && message.message === "/start 50") {
    Meteor.call('startTrivia', 50);
    return true;
  }
  if (isAdmin && message.message === "/start 45") {
    Meteor.call('startTrivia', 45);
    return true;
  }
  if (isAdmin && message.message === "/start 40") {
    Meteor.call('startTrivia', 40);
    return true;
  }
  if (isAdmin && message.message === "/start 30") {
    Meteor.call('startTrivia', 30);
    return true;
  }
  if (isAdmin && message.message === "/start 20") {
    Meteor.call('startTrivia', 20);
    return true;
  }
  if (isAdmin && message.message === "/start 10") {
    Meteor.call('startTrivia', 10);
    return true;
  }
  if (isAdmin && message.message === "/stop") {
    Meteor.call('stopTrivia');
    return true;
  }
  if (isAdmin && message.message === "/clear") {
    _clearChat();
    return true;
  }
  if (isAdmin && message.message === "/initdb") {
    Meteor.call('initializeDatabase');
    return true;
  }
  if (isAdmin && message.message === "/initq") {
    Meteor.call('initializeQuestions');
    return true;
  }
};

//-----------
//  Private
//-----------

_clearChat = function() {
  Messages.remove({});
};
