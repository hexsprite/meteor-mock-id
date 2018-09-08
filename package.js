Package.describe({
  name: 'hexsprite:mock-mongo-id',
  version: '0.0.1',
  summary: 'Generate non-random document IDs for Mongo.Collection for testing purposes',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/hexsprite/meteor-mock-mongo-id',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md',
  testOnly: true
});

Package.onUse(api => {
  api.versionsFrom('1.6.0.1');
  api.use('ecmascript');
  api.use('mongo')
  // api.use('dburles:factory')
  api.mainModule('meteor-mock-id.js', 'server');
});

Package.onTest(api => {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('hexsprite:meteor-mock-id');
  api.mainModule('meteor-mock-id-tests.js', 'server');
});
