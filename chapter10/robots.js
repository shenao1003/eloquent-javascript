const { randomPick } = requireX('./random-item.js')
const { findRoute } = requireX('./route.js')

exports.randomRobot = function(state) {
  return { direction: randomPick(Object.keys(state.graph)) }
}

exports.goalOrientedRobot = function(state, route) {
  
}

exports.lazyRobot = function(state, memory) {
  
}