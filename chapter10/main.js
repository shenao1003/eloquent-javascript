const fs = require('fs')

requireX.cache = Object.create(null)

function requireX(name) {
  if (!(name in requireX.cache)) {
    const code = fs.readFileSync(name)
    const module = { exports: {} }
    requireX.cache[name] = module
    const wrapper = Function('requireX, exports, module', code)
    wrapper(requireX, module.exports, module)
  }
  return requireX.cache[name].exports
}

const { roadGraph } = requireX('./roads.js')
const { compareRobots } = requireX('./state.js')
const { randomRobot, goalOrientedRobot, lazyRobot } = requireX('./robots.js')

compareRobots(roadGraph, randomRobot, [], goalOrientedRobot, [])
compareRobots(roadGraph, goalOrientedRobot, [], lazyRobot, [])