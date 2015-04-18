Package.describe({
  name: 'cafe-core',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');

  api.use(['templating'], 'client');
  api.use([
    'standard-app-packages',
    'twbs:bootstrap@=3.3.1_2',
    'jquery',
    'iron:router',
    'cfs:standard-packages',
    'cfs:gridfs',
    'momentjs:moment',
    'accounts-base',
    'accounts-password',
    'mizzao:user-status@=0.6.3',
    'mrt:flash-messages@=0.2.4'
  ]);

  // Client files

  addClientFiles(api, 'compatibility', [
    'autolinker.js'
  ]);

  addClientFiles(api, '', [
    'notifications.js'
  ]);

  addClientFiles(api, 'members', [
    'account-deleted.html',
    'change-password.html', 'change-password.js',
    'log-in.html', 'log-in.js',
    'members.html', 'members.js', 'members.css',
    'profile.html', 'profile.js',
    'reset-password-confirm.html', 'reset-password-confirm.js',
    'reset-password-request.html', 'reset-password-request.js',
    'reset-password-wait.html',
    'sign-up.html', 'sign-up.js',
    'welcome.html', 'welcome.js'
  ]);

  addClientFiles(api, 'chat', [
    'chat.html', 'chat.js', 'chat.css'
  ]);

  addClientFiles(api, '', [
    'layout.html', 'default.html', 'layout.css', 'style.css',
    'misc.js',
    'main.js'
  ]);

  addPublicFiles(api, '', [
    'hang_cat.jpg',
    'KnPWRing.gif',
    'mozilla.gif',
    'oh_god_why.jpg',
    'vitalbutton.gif',
    'knj2.jpg'
  ]);

  // Server files

  addServerFiles(api, '', [
    'chat.js', 'commands.js', 'main.js', 'members.js'
  ]);

  // Shared files

  addFiles(api, '', [
    'cafe-core.js'
  ]);

  api.export(['CafeCore', 'Notifications', 'CafeNews', 'CafeGames', 'CafeJam']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('cafe-core');
  api.addFiles('cafe-core-tests.js');
});

// File helpers

var addClientFiles = function(api, path, files) {
  if (!path) { path = ''; }
  else { path += '/'; }
  addFiles(api, 'client/' + path, files, 'client');
}

var addServerFiles = function(api, path, files) {
  if (!path) { path = ''; }
  else { path += '/'; }
  addFiles(api, 'server/' + path, files, 'server');
}

var addPublicFiles = function(api, path, files) {
  if (!path) { path = ''; }
  else { path += '/'; }
  addFiles(api, 'public/' + path, files);
}

var addFiles = function(api, path, files, mode) {
  for (var i = 0; i < files.length; ++i) {
    var filePath = path + files[i];
    if (mode) {
      api.addFiles(filePath, mode);
    }
    else {
      api.addFiles(filePath);
    }
  }
}
