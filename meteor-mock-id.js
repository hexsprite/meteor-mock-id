const idGenerators = new Map()
function getIdGenerator(collectionName) {
  let name = collectionName.toLowerCase().replace('_', '')
  if (idGenerators.has(name)) {
    return idGenerators.get(name)
  }
  let counter = 2
  const makeNewId = function _makeNewID() {
    while (counter.toString().indexOf('0') !== -1 || counter.toString().indexOf('1') !== -1) {
      counter++
    }
    const newId = `${name.slice(0, 17 - counter.toString().length)}${counter++}`.padEnd(17, 'x')
    return newId
  }
}

// replace Mongo.Collection with a Proxy that overrides _makeNewID
const _orig_Collection = Mongo.Collection
Mongo.Collection = new Proxy(_orig_Collection, {
  construct(target, args) {
    const collection = new target(...args)
    if (collection._name) {
      collection._makeNewID = getIdGenerator(collection._name)
    }
    return collection
  }
})
Mongo.Collection.prototype.constructor = Mongo.Collection

// // Patch Factory
// import { Factory } from 'meteor/dburles:factory'
// const orig_build = Factory._build
// Factory._build = function(name, attributes = {}, userOptions = {}, options = {}) {
//   if (!attributes._id) {
//     attributes._id = getIdGenerator(name)
//   }
// }
