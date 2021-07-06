const { randomPick } = requireX('./random-item.js')
const { findRoute } = requireX('./route.js')

exports.randomRobot = function(state) {
  return { direction: randomPick(Object.keys(state.graph)) }
}

exports.goalOrientedRobot = function(state, memory) {
  if (!memory.length) {
    const { place, address } = state.parcels[0]
    if (place === state.place) {
      memory = findRoute(state, place, address)
    } else {
      memory = findRoute(state, state.place, place)
    }
  }
  return {
    direction: memory[0],
    memory: memory.slice(1)
  }
}

exports.lazyRobot = function(state, memory) {
  if (!memory.length) {
    const routes = state.parcels.map(({ place, address }) => {
      return
    })
    function score({ route, pickUp }) {
      return - route.length + pickUp ? 0.5 : 0
    }
    memory = routes.reduce((a, b) => score(a) > score(b) ? a : b)
  }
  return {
    direction: memory[0],
    memory: memory.slice(1)
  }
}