//-------------
//  Interface
//-------------

initChat = function() {
  console.log("Initializing chat.");
  Meteor.subscribe("chat");
};

//------------------
//  Data providers
//------------------

Template.messages.helpers({
  messages: function() {
    if (!Meteor.user()) { return []; }
    return Messages.find({}, {sort: {createdAt: 1}});
  }
});

Template.userList.helpers({
  users: function() {
    return Meteor.users.find({'status.online': true}, {sort: {score: -1, username: 1}});
  },

  visitorStatus: function() {
    count = Meteor.users.find({username:null}, {sort: {score: -1, username: 1}}).count();
    if (count == 1) {
      return count + " visitor";
    }
    else {
      return count + " visitors";
    }
  }
});

Template.chat.helpers({
  loggedIn: function() {
    return Meteor.user() !== null;
  }
});

//----------
//  Events
//----------

Template.chat.events = {
  'submit' : function(e, tmpl) {
    e.preventDefault();

    var newMessage = {
      userId: Meteor.userId(),
      username : Meteor.user().username,
      message : tmpl.find("#chatInput").value
    };

    // Clear the old message.
    tmpl.find("#chatInput").value = "";

    Meteor.call(
      "addMessage",
      newMessage,
      function (err, result) {
        if (err) {
          alert(err.reason);
        }
      }
    );
  }
};

Template.username.events =
{
  'change #userName': function(event) {
    if ($('#userName').val().length > 0 && Meteor.userId()) {
      Meteor.users.update({_id: Meteor.userId()}, {
          $set: {
              profile: {name: $('#userName').val()}
          }
      });
      Meteor.call('heartbeat');
    }
  }
};

// Update the chat window position as new elements are added.
Template.messages.rendered = function() {
  $("#chatWindow").scrollTop($("#chatWindow")[0].scrollHeight);
};

Template.chat.rendered = function() {
  $("#chatInput").focus();
};

Template.username.rendered = function() {
  $("#userName").focus();
};
