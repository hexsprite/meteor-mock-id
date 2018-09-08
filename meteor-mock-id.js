let counters = new Map()

function resetCounters () {
  counters = new Map()
}

Meteor.startup(() => {
  global.afterEach(() => {
    resetCounters()
  })
})

// replace Mongo.Collection with a Proxy that overrides _makeNewID
const _orig_Collection = Mongo.Collection
Mongo.Collection = new Proxy(_orig_Collection, {
  construct (target, args) {
    const collection = new target(...args)
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
        shortName = name.slice(0, 17 - counter.toString().length)
        const newId = `${shortName}${counter++}`.padEnd(17, 'x')
        counters.set(name, counter)
        return newId
      }
    }
    return collection
  }
})
Mongo.Collection.prototype.constructor = Mongo.Collection
