function elt(type, ...children) {
  const node = document.createElement(type)
  for (const child of children) {
    node.appendChild(
      child instanceof Node
      ? child
      : document.createTextNode(child)
    )
  }
  return node
}

// Build a table

const MOUNTAINS = [
  {name: "Kilimanjaro", height: 5895, place: "Tanzania"},
  {name: "Everest", height: 8848, place: "Nepal"},
  {name: "Mount Fuji", height: 3776, place: "Japan"},
  {name: "Vaalserberg", height: 323, place: "Netherlands"},
  {name: "Denali", height: 6168, place: "United States"},
  {name: "Popocatepetl", height: 5465, place: "Mexico"},
  {name: "Mont Blanc", height: 4808, place: "Italy/France"}
]

function buildTable(data) {
  const fields = Object.keys(data[0])
  const headRow = elt('tr', ...fields.map(field => elt('th', field)))
  const rows = data.map(mountain => elt('tr', ...fields.map(field => {
    const content = mountain[field]
    const cell = elt('td', content)
    if (typeof content === 'number') {
      cell.style.textAlign = 'right'
    }
    return cell
  })))
  return elt('table', headRow, ...rows)
}

document.getElementById('mountains').appendChild(buildTable(MOUNTAINS))

// Elements by tag name

function byTagName(node, tagName) {
  let collection = []
  for (const child of node.children) {
    if (child.nodeName === tagName.toUpperCase()) {
      collection.push(child)
    }
    if (child.children.length) {
      collection = collection.concat(byTagName(child, tagName))
    }
  }
  return collection
}

// The cat's hat

let cat = document.querySelector("#cat")
let hat = document.querySelector("#hat")

let angle = 0
let lastTime = null
function animate(time) {
  if (lastTime != null) angle += (time - lastTime) * 0.001
  lastTime = time
  cat.style.top = (Math.sin(angle) * 40 + 40) + 'px'
  cat.style.left = (Math.cos(angle) * 200 + 230) + 'px'
  
  hat.style.top = (Math.sin(angle + Math.PI) * 40 + 40) + 'px'
  hat.style.left = (Math.cos(angle + Math.PI) * 200 + 230) + 'px'

  requestAnimationFrame(animate)
}
requestAnimationFrame(animate)