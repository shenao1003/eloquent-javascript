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