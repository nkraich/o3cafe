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
    if (isCommand(newMessage)) {
      if (runCommand(newMessage)) {
        return;
      }
    }

    if (newMessage.username === "") {
      throw new Meteor.Error(
        413,
        "You have a username to post a message."
      );
    }
    if (newMessage.message === "") {
      throw new Meteor.Error(
        413,
        "Please type a message to send."
      );
    }

    // Trim whitespace.
    newMessage.message = newMessage.message.trim();

    newMessage.createdAt = new Date();
    var id = Messages.insert(newMessage);
    
    return id;
  }
});
