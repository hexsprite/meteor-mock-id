Package.describe({
  name: 'hexsprite:mock-mongo-id',
  version: '0.1.0',
  summary:
    'Generate non-random document IDs for Mongo.Collection for testing purposes',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/hexsprite/meteor-mock-mongo-id',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md',
  testOnly: true
})

Package.onUse(function (api) {
  api.versionsFrom('1.6.0.1')
  api.use('typescript@4.0.0 || 3.0.0')
  api.use('mongo')
  api.use('meteortesting:mocha-core@8.1.2')
  api.mainModule('meteor-mock-id.ts', 'server')
})

Package.onTest(function (api) {
  api.use('typescript')
  api.use('tinytest')
  api.use('hexsprite:mock-mongo-id')
  api.mainModule('meteor-mock-id-tests.ts', 'server')
})
