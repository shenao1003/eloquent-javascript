const roads = [
  "Alice's House-Bob's House",   "Alice's House-Cabin",
  "Alice's House-Post Office",   "Bob's House-Town Hall",
  "Daria's House-Ernie's House", "Daria's House-Town Hall",
  "Ernie's House-Grete's House", "Grete's House-Farm",
  "Grete's House-Shop",          "Marketplace-Farm",
  "Marketplace-Post Office",     "Marketplace-Shop",
  "Marketplace-Town Hall",       "Shop-Town Hall"
]

function buildGraph(edges) {
  const graph = Object.create(null)
  function addEdge(from, to) {
    if (graph[from]) {
      graph[from].push(to)
    } else {
      graph[from] = [to]
    }
  }
  for (const [from, to] of edges.map(r => r.split('-'))) {
    addEdge(from, to)
    addEdge(to, from)
  }
  return graph
}

const roadGraph = buildGraph(roads)

class VillageState {
  constructor(place, parcels) {
    this.place = place
    this.parcels = parcels
  }

  move(destination) {
    if (!roadGraph[this.place].includes(destination)) {
      return this
    }

    const parcels = this.parcels.map(p => {
      const { id, place, address } = p
      if (place === this.place) {
        // todo
        // console.log(`Parcel ${id} carried at ${place}.`)
        return { id, place: destination, address }
      } else {
        return p
      }
    }).filter(({ id, place, address }) => {
      const arrived = place === address
      if (arrived) {
        // console.log(`Parcel ${id} deliverd to ${address}.`)
      }
      return !arrived
    })

    return new VillageState(destination, parcels)
  }

  static random(parcelCount = 5) {
    const parcels = []
    for (let id = 1; id <= parcelCount; id++) {
      const places = Object.keys(roadGraph)
      const place = randomPick(places)
      let address = ''
      do {
        address = randomPick(places)
      } while (address === place)
      parcels.push({ id, place, address })
    }
    return new VillageState('Post Office', parcels)
  }
}

const village = new VillageState('Post Office', [
  { id: 1 , place: "Post Office", address: "Alice's House" },
  { id: 2 , place: "Daria's House", address: "Post Office" },
  { id: 3 , place: "Marketplace", address: "Town Hall" }
])

function runRobot(state, robot, memory) {
  for (let turn = 0; ; turn++) {
    if (!state.parcels.length) {
      // console.log(`Done in ${turn} turns.`)
      return turn
    }
    const action = robot(state, memory)
    state = state.move(action.direction)
    memory = action.memory
    // console.log(`Moved to ${action.direction}.`)
  }
}

function randomRobot(state) {
  return { direction: randomPick(roadGraph[state.place]) }
}

function randomPick(array) {
  return array[Math.floor(Math.random() * array.length)]
}

const mailRoute = [
  "Alice's House",
  "Cabin",
  "Alice's House",
  "Bob's House",
  "Town Hall",
  "Daria's House",
  "Ernie's House",
  "Grete's House",
  "Shop",
  "Grete's House",
  "Farm",
  "Marketplace",
  "Post Office"
]

function routeRobot(state, memory) {
  if (memory.length === 0) {
    memory = mailRoute
  }
  return { direction: memory[0], memory: memory.slice(1) }
}

function findRoute(graph, from, to) {
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

function goalOrientedRobot({ place, parcels }, route) {
  if (!route.length) {
    const parcel = parcels[0]
    route = findRoute(roadGraph, place, place === parcel.place ? parcel.address : parcel.place)
  }

  return {
    direction: route[0],
    memory: route.slice(1)
  }
}

function compareRobots(robot1, memory1, robot2, memory2, parcelCount = 5, repeatCount = 100) {
  let step1 = 0,
      step2 = 0
  for (let i = 0; i < repeatCount; i++) {
    const state = VillageState.random(parcelCount)
    step1 += runRobot(state, robot1, memory1)
    step2 += runRobot(state, robot2, memory2) 
  }
  console.log(`The average step of robot1 is ${Math.floor(step1 / repeatCount * 10) / 10}`)
  console.log(`The average step of robot2 is ${Math.floor(step2 / repeatCount * 10) / 10}`)
}

function efficientRobot({ place, parcels }, route) {
  if (!route.length) {
    const routes = parcels.map(p => {
      if (place === p.place) {
        return {
          route: findRoute(roadGraph, place, p.address),
          pickUp: false
        }
      } else {
        return {
          route: findRoute(roadGraph, place, p.place),
          pickUp: true
        }
      }
    })

    function score({ route, pickUp }) {
      return (pickUp ? 0.5 : 0) - route.length
    }
    
    route = routes.reduce((a, b) => score(a) > score(b) ? a : b).route
  }

  return {
    direction: route[0],
    memory: route.slice(1)
  }
}

// runRobot(VillageState.random(), randomRobot, [])
// runRobot(VillageState.random(), routeRobot, [])
// runRobot(VillageState.random(), goalOrientedRobot, [])
// compareRobots(routeRobot, [], goalOrientedRobot, [])
// compareRobots(goalOrientedRobot, [], efficientRobot, [])

class PGroup {
  constructor(members = []) {
    this.members = members
  }

  add(item) {
    if (!this.has(item)) {
      return new PGroup(this.members.concat(item))
    }
    return this
  }

  delete(item) {
    const idx = this.members.indexOf(item)
    if (idx !== -1) {
      return new PGroup(this.members.slice(0, idx).concat(this.members.slice(idx + 1)))
    }
    return this
  }

  has(item) {
    return this.members.includes(item)
  }
}

PGroup.empty = new PGroup()