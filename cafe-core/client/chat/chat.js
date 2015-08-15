//-------------
//  Interface
//-------------

initChat = function() {
  console.log("Initializing chat.");
  Session.set('lastNotificationTime', new Date());
  Meteor.subscribe("chat");
};

//------------------
//  Data providers
//------------------

Template.messages.helpers({
  messages: function() {
    var messages, i, lastTimestamp;

    if (!Meteor.user()) { return []; }

    messages = Messages.find({}, {sort: {createdAt: 1}}).fetch();
    lastTimestamp = 0;

    for (i = 0; i < messages.length; i++)
    {
      if (messages[i].createdAt.getTime() > (lastTimestamp + (30 * 60 * 1000)) || i === 0) {
        messages[i].showTimestamp = true;
      }
      else {
        messages[i].showTimestamp = false;
      }
      lastTimestamp = messages[i].createdAt.getTime();
    }

    return messages;
  }
});

Template.message.helpers({
  formatDate: function(date) {
    if (date) {
      return moment(date).calendar();
    }
    else {
      return "";
    }
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
    var newMessage;

    e.preventDefault();

    newMessage = {
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
Template.message.rendered = function() {
  $("#chatWindow").scrollTop($("#chatWindow")[0].scrollHeight);

  var lastTime, currentTime, message;
  lastTime = Session.get('lastNotificationTime');
  currentTime = new Date();
  message = Messages.findOne({}, {sort: {createdAt: -1}});

  // Show a new alert if it's been more than 5 seconds from the last one.
  if ((currentTime - lastTime) > 5000 && Meteor.userId() !== message.userId) {
    Session.set('lastNotificationTime', currentTime);
    if (Meteor.user().profile.notifications) {
      notify.createNotification('New message', {body: message.username + ': ' + message.message, icon: 'images/chat.ico'});
    }
  }
};

Template.chat.rendered = function() {
  $("#chatInput").focus();
};

Template.username.rendered = function() {
  $("#userName").focus();
};
