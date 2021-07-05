const { randomPick } = requireX('./random-item.js')

exports.findRoute = function(graph, from, to) {
  const work = [{ at: from, route: [] }]



  return route
}

exports.randomRoute = function(graph, from, length) {
  const route = []
  for (let i = 1; i < length; i++) {
    const place = randomPick(graph[from])
    if (!route.includes(place)) {
      from = place
      route.push(place)
    }
  }
  return route
}