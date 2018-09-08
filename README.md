This package patches Mongo.Collection on server side to generate consistent
incremental IDs based on the name of the collection.

The intention is to use this in automated tests for snapshotting collections
of documents.

As such this is a `testOnly` package.

They look like:

`actions2xxxxxxxxx`
and
`users2xxxxxxxxxxx`

The results are padded to 17 characters and exclude 0 and 1 since they are not
considered "valid" Meteor mongo ID by SimpleSchema.

The counters are reset after each test is run. Tested with `meteortesting:mocha`.

### INSTALLATION

Make sure that you put `hexsprite:mock-mongo-id` at the top of the
`.meteor/packages` file so that it can hook into things before any collections
are defined.

