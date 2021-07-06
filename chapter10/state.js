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
        const arrived = place === address
        if (arrived) {
          console.log(`Parcel ${id} arrived at ${place}`)
        }
        return !arrived
      })
    return new VillageState(this.graph, destination, parcels)
  }

  static random(graph, robotPlace, parcelCount = 5) {
    const parcels = []
    for (let i = 0; i < parcelCount; i++) {
      const places = Object.keys(graph)
      const place = randomPick[places]
      let address = ''
      do {
        address = randomPick[places]
      } while (address === place)
      parcels.push({ id: i + 1, place, address })
    }
    return new VillageState(graph, robotPlace, parcels)
  }
}

exports.runRobot = function(robot, state, memory) {
  for (let turn = 0; ; turn++) {
    if (!state.parcels.length) {
      console.log(`Done in ${turn} turns`)
      return
    }

    const action = robot(state, memory)
    state = state.move(action.direction)
    memory = action.memory
  }
}