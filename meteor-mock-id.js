let counters = new Map()

function resetCounters () {
  counters = new Map()
}

Meteor.startup(() => {
  global.afterEach(() => {
    resetCounters()
  })
})

const constructor = Mongo.Collection

const newCollection = function () {
  let ret = constructor.apply(this, arguments)
  let collection = this
  if (collection._name) {
    let counter = 2
    let name = collection._name.toLowerCase().replace('_', '')
    counters.set(name)
    collection._makeNewID = function _makeNewID () {
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
    collection.insert = function(doc, ...args) {
      if (doc._id) {
        const err = new Error()
        if (err.stack.indexOf('Function.Factory._create (packages/dburles:factory/factory.js') !== -1) {
          doc._id = this._makeNewID()
        }
      }
      return _insert.call(this, doc, ...args)
    }
  }
  return ret
}

for (let prop in constructor) {
  if (constructor.hasOwnProperty(prop)) {
    newCollection[prop] = constructor[prop]
  }
}

newCollection.prototype = Mongo.Collection.prototype
newCollection.prototype.constructor = newCollection
Mongo.Collection = newCollection
Meteor.Collection = Mongo.Collection

// allow simpl-schema to validate these ids
const RegEx = require('simpl-schema').RegEx
const IdReString = RegEx.Id.toString()
const newReString = `(${IdReString.slice(1, IdReString.length - 1)})|([a-z]+\\d+x*)`
RegEx.Id = new RegExp(newReString)
