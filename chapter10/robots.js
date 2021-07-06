const { randomPick } = requireX('./random-item.js')
const { findRoute } = requireX('./route.js')

exports.randomRobot = function(state) {
  return { direction: randomPick(state.graph[state.place]) }
}

exports.goalOrientedRobot = function({ graph, place, parcels }, memory) {
  if (!memory.length) {
    const parcel = parcels[0]
    if (parcel.place === place) {
      memory = findRoute(graph, place, parcel.address)
    } else {
      memory = findRoute(graph, place, parcel.place)
    }
  }
  return {
    direction: memory[0],
    memory: memory.slice(1)
  }
}

exports.lazyRobot = function({ graph, place, parcels }, memory) {
  if (!memory.length) {
    const routes = parcels.map(p => {
      if (p.place === place) {
        return { route: findRoute(graph, place, p.address), pickUp: false }
      } else {
        return { route: findRoute(graph, place, p.place), pickUp: true }
      }
    })
    function score({ route, pickUp }) {
      return pickUp ? 0.5 : 0 - route.length
    }
    memory = routes.reduce((a, b) => score(a) > score(b) ? a : b).route
  }
  return {
    direction: memory[0],
    memory: memory.slice(1)
  }
}