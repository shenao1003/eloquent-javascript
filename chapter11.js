// Message routing

requestType('connections', (nest, { name, neighbors }, source) => {
  const { connections } = nest.state
  if (JSON.stringify(connections.get(name)) === JSON.stringify(neighbors)) { return }
  connections.set(name, neighbors)
  broadcastConnections(nest, name, source)
})

function broadcastConnections(nest, name, exceptFor = null) {
  const neighbors = nest.state.connections.get(name)
  for (const neighbor of nest.neighbors) {
    if (neighbor === exceptFor) { continue }
    request(nest, neighbor, 'connections', { name, neighbors })
  }
}

everywhere(nest => {
  nest.state.connections = new Map()
  nest.state.connections.set(nest.name, nest.neighbors)
  broadcastConnections(nest, nest.name)
})

function findRoute(from, to, connections) {
  const work = [{ at: from, via: null }]
  for (let i = 0; i < work.length; i++) {
    const { at, via } = work[i]
    for (const next of connections.get(at) || []) {
      if (next === to) { return via }
      if (work.every(w => w.at !== next)) {
        work.push({ at: next, via: via || at })
      }
    }
  }
  return null
}

function routeRequest(nest, target, type, content) {
  if (nest.neighbors.includes(target)) {
    return request(nest, target, type, content)
  }
  const via = findRoute(nest.name, target, nest.state.connections)
  if (!via) throw new Error(`No route to ${target}`)
  return request(nest, via, 'route', { target, type, content })
}

requestType('route', (nest, { target, type, content }) => {
  return routeRequest(nest, target, type, content)
})

// Async functions

requestType('storage', (nest, name) => storage(nest, name))

function findInStorage(nest, name) {
  return storage(nest, name).then(data => {
    if (data) { return data }
    return findInRemoteStorage(nest, name)
  })
}

function network(nest) {
  return Array.from(nest.state.connections.keys())
}

function findInRemoteStorage(nest, name) {

}