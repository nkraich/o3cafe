Package.describe({
  name: 'cafe-wall',
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

  //api.use(['insecure']);
  api.use(['cafe-core']);
  api.use(['templating'], 'client');
  api.use([
    'cfs:standard-packages',
    'cfs:gridfs',
    'momentjs:moment'
  ]);

  api.addFiles('cafe-wall.js');

  api.addFiles(['client/archive.html'], 'client');
  api.addFiles(['client/wall.html', 'client/wall.js', 'client/wall.css'], 'client');

  api.addFiles(['server/wall.js'], 'server');

  api.export(['CafeWall']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('cafe-wall');
  api.addFiles('cafe-wall-tests.js');
});
