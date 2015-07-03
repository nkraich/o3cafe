routeConfigurations = [];
mainMenuItems = [];

/*CafeNews = {
  menuItemName: "News",
  menuItemIcon: "globe",
  menuItemRoutePath: "/news"
};*/

CafeGames = {
  menuItemName: "Games",
  menuItemIcon: "picture",
  menuItemRoutePath: "/games"
};

CafeJam = {
  menuItemName: "Jam",
  menuItemIcon: "wrench",
  menuItemRoutePath: "/jam"
};

/*CafeWall = {
  menuItemName: "Wall",
  menuItemIcon: "bullhorn",
  menuItemRoutePath: "/wall"
};*/

GlobalConfigs = new Meteor.Collection("globalConfigs");
Messages = new Meteor.Collection("messages"); 
//Channels = new Meteor.Collection("channels");
//Questions = new Meteor.Collection("questions");
//Scores = new Meteor.Collection("scores"); 

CafeCore = {
  addModule: function(module, menuItemName, menuItemIcon, menuItemRoutePath) {
    if (module.routeConfiguration) {
      routeConfigurations.push(module.routeConfiguration);
    }
    _addToMenu(module, menuItemName, menuItemIcon, menuItemRoutePath);
  },

  run: function(defaultModule) {
    var defaultRoutePath = defaultModule.menuItemRoutePath;

    Router.configure({
      layoutTemplate: 'layout'
    });

    Router.route('/', function () {
      if (defaultRoutePath) {
        this.redirect(defaultRoutePath);
      }
      else {
        this.render('default');
      }
    });

    Router.route('/games', function () {
      this.render('games');
    });

    // Members

    Router.route('/members', function () {
      this.render('members');
    });

    Router.route('/profile', function () {
      this.render('profile');
    });

    Router.route('/sign-up', function () {
      this.render('signUp');
    });

    Router.route('/log-in', function () {
      this.render('logIn');
    });

    Router.route('/log-out', function () {
      Meteor.logout();
      this.render('logIn');
    });

    Router.route('/account-deleted', function () {
      this.render('accountDeleted');
    });

    Router.route('/welcome', function () {
      this.render('welcome');
    });

    // Passwords

    Router.route('/change-password', function () {
      if (Meteor.user()) {
        this.render('changePassword');
      }
      else {
        this.redirect('/log-in');
      }
    });

    Router.route('/reset-password', function () {
      this.render('resetPasswordRequest');
    });

    Router.route('/reset-password/wait', function () {
      this.render('resetPasswordWait');
    });

    Router.route('/reset-password/:token', function () {
      Session.set('resetPasswordToken', this.params.token);
      this.render('resetPasswordConfirm');
    });

    // Jam

    Router.route('/jam/results', function () {
      this.render('jam1Results');
    });

    Router.route('/jam/rules', function () {
      this.render('jam1Rules');
    });

    // News

    Router.route('/news', function () {
      this.render('news');
    });

    // Apply route configurations for all modules

    for (var i = 0; i < routeConfigurations.length; i++) {
      routeConfigurations[i](Router);
    }

    // Reset flash messages when a new page is rendered

    Router.onAfterAction(function() {
      FlashMessages.clear();
    });
  }
};

var _addToMenu = function(module, menuItemName, menuItemIcon, menuItemRoutePath) {
  if (!menuItemName) { menuItemName = module.menuItemName; }
  if (!menuItemIcon) { menuItemIcon = module.menuItemIcon; }
  if (!menuItemRoutePath) { menuItemRoutePath = module.menuItemRoutePath; }
  
  mainMenuItems.push({
    name: menuItemName,
    icon: menuItemIcon,
    routePath: menuItemRoutePath
  });
};
