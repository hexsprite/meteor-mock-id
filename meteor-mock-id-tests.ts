// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from 'meteor/tinytest'

// Import and rename a variable exported by meteor-mock-id.js.
import { name as packageName } from 'meteor/meteor-mock-id'

// Write your tests here!
// Here is an example.
Tinytest.add('meteor-mock-id - example', function (test) {
  test.equal(packageName, 'meteor-mock-id')
})
