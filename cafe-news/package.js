Package.describe({
  name: 'cafe-news',
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
    'momentjs:moment'
  ]);

  api.addFiles('cafe-news.js');

  api.addFiles(['client/news.html', 'client/news.js', 'client/news.css'], 'client');

  api.addFiles(['server/news.js'], 'server');

  api.export(['CafeNews']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('cafe-news');
  api.addFiles('cafe-news-tests.js');
});
