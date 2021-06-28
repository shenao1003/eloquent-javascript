class Vec {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  plus(vec) {
    const { x, y } = vec
    return new Vec(this.x + x, this.y + y)
  }

  minus(vec) {
    const { x, y } = vec
    return new Vec(this.x - x, this.y - y)
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }
}

class Group {
  constructor() {
    this.members = []
  }

  add(item) {
    if (!this.has(item)) {
      this.members.push(item)
    }
  }

  delete(item) {
    const idx = this.members.indexOf(item)
    if (idx !== -1) {
      this.members.splice(idx, 1)
    }
  }

  has(item) {
    return this.members.includes(item)
  }

  static from(collection) {
    const group = new Group()
    for (const item of collection) {
      group.add(item)
    }
    return group
  }

  [Symbol.iterator]() {
    return new GroupIterator(this)
  }
}

class GroupIterator {
  constructor(group) {
    this.group = group
    this.idx = 0
  }

  next() {
    if (this.idx >= this.group.members.length) {
      return { done: true }
    }

    return {
      value: this.group.members[this.idx++],
      done: false
    }
  }
}