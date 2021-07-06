const { randomPick } = requireX('./random-item.js')

class VillageState {
  constructor(graph, place, parcels) {
    this.graph = graph
    this.place = place
    this.parcels = parcels
  }

  move(destination) {
    if (!this.graph[this.place].includes(destination)) {
      return this
    }

    const parcels = this.parcels
      .map(p => {
        const o = {}
        if (p.place === this.place) {
          o.place = destination
        }
        return Object.assign({}, p, o)
      })
      .filter(({ id, place, address }) => {
        const arrived = place === address
        if (arrived) {
          // console.log(`Parcel ${id} arrived at ${place}`)
        }
        return !arrived
      })
    return new VillageState(this.graph, destination, parcels)
  }

  static random(graph, parcelCount = 5) {
    const parcels = []
    const places = Object.keys(graph)
    for (let i = 0; i < parcelCount; i++) {
      const place = randomPick(places)
      let address = ''
      do {
        address = randomPick(places)
      } while (address === place)
      parcels.push({ id: i + 1, place, address })
    }
    return new VillageState(graph, randomPick(places), parcels)
  }
}

function runRobot(robot, state, memory) {
  for (let turn = 0; ; turn++) {
    if (!state.parcels.length) {
      // console.log(`Done in ${turn} turns`)
      return turn
    }

    const action = robot(state, memory)
    state = state.move(action.direction)
    memory = action.memory
  }
}

exports.VillageState = VillageState
exports.runRobot = runRobot

exports.compareRobots = function(graph, robot1, memory1, robot2, memory2, parcelCount = 5, repeatCount = 100) {
  let step1 = 0,
      step2 = 0
  for (let i = 0; i < repeatCount; i++) {
    const state = VillageState.random(graph, parcelCount)
    step1 += runRobot(robot1, state, memory1)
    step2 += runRobot(robot2, state, memory2) 
  }
  console.log(`The average step of robot1 is ${Math.floor(step1 / repeatCount * 10) / 10}`)
  console.log(`The average step of robot2 is ${Math.floor(step2 / repeatCount * 10) / 10}`)
}