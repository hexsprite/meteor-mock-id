// replace Mongo.Collection with a Proxy that overrides _makeNewID
const _orig_Collection = Mongo.Collection
Mongo.Collection = new Proxy(_orig_Collection, {
  construct(target, args) {
    const collection = new target(...args)
    if (collection._name) {
      let counter = 2
      let name = collection._name.toLowerCase().replace('_', '')
      collection._makeNewID = function _makeNewID() {
        while (counter.toString().indexOf('0') !== -1 || counter.toString().indexOf('1') !== -1) {
          counter++
        }
        const newId = `${name.slice(0, 17 - counter.toString().length)}${counter++}`.padEnd(17, 'x')
        return newId
      }.bind(collection)
    }
    return collection
  }
})
Mongo.Collection.prototype.constructor = Mongo.Collection

