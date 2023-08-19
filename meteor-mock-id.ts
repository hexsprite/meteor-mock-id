import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

const constructor = Mongo.Collection

let anonCounter = 0

const newCollection = function (this: Mongo.Collection<unknown>) {
  const ret = constructor.apply(this, arguments)
  const collection = this
  const baseName: string = collection._name ?? `anon${anonCounter++}.`
  let counter = 2
  const name = baseName.toLowerCase().replace('_', '')

  collection._makeNewID = function _makeNewID() {
    counter = counters.get(name) || 2
    while (
      counter.toString().indexOf('0') !== -1 ||
      counter.toString().indexOf('1') !== -1
    ) {
      counter++
    }
    const shortName = name.slice(0, 17 - counter.toString().length)
    const newId = `${shortName}${counter++}`.padEnd(17, 'x')
    counters.set(name, counter)
    return newId
  }

  // override insert using custom _id (used by dburles:factory)
  const _insert = collection.insert
  collection.insert = function (doc, ...args) {
    if (doc._id) {
      const err = new Error()
      if (err.stack?.indexOf('packages/dburles:factory/factory.js') !== -1) {
        doc._id = this._makeNewID()
      }
    }
    return _insert.call(this, doc, ...args)
  }
  return ret
}

for (const prop in constructor) {
  if (constructor.hasOwnProperty(prop)) {
    newCollection[prop] = constructor[prop]
  }
}

// don't patch during E2E acceptance test to allow for easy parallelization
if (!process.env.METEOR_E2E_TEST) {
  newCollection.prototype = Mongo.Collection.prototype
  newCollection.prototype.constructor = newCollection
  Mongo.Collection = newCollection
  Meteor.Collection = Mongo.Collection

  // allow simpl-schema to validate these ids
  const RegEx = require('simpl-schema').RegEx
  if (RegEx) {
    const IdReString = RegEx.Id.toString()
    const newReString = `(${IdReString.slice(
      1,
      IdReString.length - 1,
    )})|([a-z]+\\d+x*)`
    RegEx.Id = new RegExp(newReString)
  }

  global.afterEach(resetCounters)
  global.beforeEach(resetCounters)
}

let counters = new Map<string, number>()
export function resetCounters() {
  counters = new Map<string, number>()
}
