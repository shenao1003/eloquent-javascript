exports.findRoute = function(graph, from, to) {
  const work = [{ at: from, route: [] }]
  for (let i = 0; i < work.length; i++) {
    const { at, route } = work[i]
    for (const place of graph[at]) {
      if (place === to) {
        return route.concat(place)
      }
      if (work.every(w => w.at !== place)) {
        work.push({ at: place, route: route.concat(place) })
      }
    }
  }
}