const { randomPick } = requireX('./random-pick.js')

exports.VillageState = class {
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
        if (p.place === this.place) {
          p.place = destination
        }
        return p
      })
      .filter(({ id, place, address }) => {
        const dropped = place === address
        if (dropped) {
          console.log(`Parcel ${id} dropped at ${place}`)
        }
        return !dropped
      })
    return new VillageState(this.graph, destination, parcels)
  }

  static random(graph, robotPlace, parcelCount = 5) {
    const parcels = []
    for (let i = 0; i < parcelCount; i++) {
      const places = Object.keys(graph)
      const place = randomPick[places]
      let address = ''
      while (true) {
        address = randomPick[places]
        if (place !== address) {
          break
        }
      }
      parcels.push({ id: i + 1, place, address })
    }
    return new VillageState(graph, robotPlace, parcels)
  }
}

exports.runRobot = function(robot, state, memory) {
  while (true) {
    if (!state.parcels.length) {
      console.log(`All parcels deliverd`)
      return
    }

    const action = robot(state, memory)
    state = state.move(action.direction)
    memory = action.memory
  }
}