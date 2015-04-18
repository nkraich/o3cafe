//--------------
//  UI Helpers
//--------------

Template.registerHelper('addLinks', function(text) {
  var result = Autolinker.link(text);
  return new Handlebars.SafeString(result);
});

Template.registerHelper('sanitizeContent', function(content) {
  content = content.replace(/<(?:.|\n)*?>/gm, '');
  content = Autolinker.link(content);
  return new Handlebars.SafeString(content);
});
