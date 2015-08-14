//------------------------------
//  K&J server
//  © 2014, Nicholas W. Kraich
//------------------------------

//--------------------
//  Server interface
//--------------------

Meteor.startup(function() {
  // Global variables for the server
  questionNumber = -1;
  timeRemaining = 0;
  question = null;

  // Module initialization
  initMain();
  initChat();
  /*initWall();
  initTrivia();
  initArcade();*/
});

initMain = function()
{
  console.log("Initializing server core.");

  // Initialize the database if it's empty.
  /*if (Questions.find().count() === 0) {
    initData();
  }*/

  // Configure user access.
  Meteor.users.allow({
    // TODO: Check for admin.  ANY USER CAN UPDATE ANY OTHER RIGHT NOW.
    update: function(userId, doc, fieldNames, modifier) {
      return true;
    },

    remove: function(userId, doc) {
      return userId === Meteor.userId();
    }
  });

  // Publish global server variables, stored in a single GlobalConfig document.
  Meteor.publish("globalConfigs", function() {
    return GlobalConfigs.find({});
  });

  // Publish the active users.
  Meteor.publish("main", function(channelName) {
    return Meteor.users.find(
      {
        //'services.resume.loginTokens': {$size: 1}
      },
      {
        fields: {'username': 1, 'score': 1, 'status': 1, 'admin': 1, 'superAdmin': 1, 'profile.vanityName': 1, 'profile.notifications': 1},
        sort: {score: 1}
      }
    );
  });
};

//--------------------
//  Client interface
//--------------------

/*Meteor.methods(
{
  initializeDatabase: function()
  {
    initData();
  },

  initializeQuestions: function()
  {
    initQuestions();
  }
});*/
