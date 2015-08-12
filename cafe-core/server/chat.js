//-----------------
//  Intialization
//-----------------

initChat = function() {
  console.log("Initializing chat.");

  Meteor.publish("chat", function(channelName) {
    return Messages.find({}, {sort: {createdAt: -1}, limit: 100});
  });
};

//-------------
//  Interface
//-------------

Meteor.methods({
  addMessage : function (newMessage)
  {
    var user, messageId;

    if (isCommand(newMessage)) {
      if (runCommand(newMessage)) {
        return;
      }
    }

    if (newMessage.message === "") {
      throw new Meteor.Error(
        413,
        "Please type a message to send."
      );
    }

    // Store user ID.
    newMessage.userId = Meteor.userId();

    // Get display name.
    user = Meteor.user();
    if (user.profile && user.profile.vanityName) {
      newMessage.username = user.profile.vanityName;
    }
    else {
      newMessage.username = user.username;
    }

    // Trim whitespace.
    newMessage.message = newMessage.message.trim();

    newMessage.createdAt = new Date();
    messageId = Messages.insert(newMessage);
    
    return messageId;
  }
});
