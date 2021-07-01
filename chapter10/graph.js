exports.buildGraph = function(roadArr) {
  const roadGraph = Object.create(null)
  function addEdge(from, to) {
    if (roadGraph[from]) {
      roadGraph[from].push(to)
    } else {
      roadGraph[from] = [to]
    }
  }
  roadArr.forEach(([start, end]) => {
    addEdge(start, end)
    addEdge(end, start)
  })
  return roadGraph
}