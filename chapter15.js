// Balloon

const p = document.querySelector('p')
let size
const MAX_SIZE = 70

function setSize(newSize) {
  size = newSize
  p.style.fontSize = `${newSize}px`
}
setSize(20)

function handleArrow(event) {
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    const newSize = size * 1.1
    if (newSize > MAX_SIZE) {
      p.textContent = '💥'
      document.body.removeEventListener('keydown', handleArrow)
    } else {
      setSize(newSize)
    }
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    setSize(size * 0.9)
  }
}
document.body.addEventListener('keydown', handleArrow)

// Mouse trail

let currentDot = 0
const dots = []
for (let i = 0; i < 12; i++) {
  const dot = document.createElement('div')
  dot.className = 'trail'
  dots.push(dot)
  document.body.appendChild(dot)
}

window.addEventListener('mousemove', event => {
  const dot = dots[currentDot]
  const { pageX, pageY } = event
  dot.style.left = `${pageX - 3}px`
  dot.style.top = `${pageY - 3}px`
  currentDot = (currentDot + 1) % dots.length
})

// Mouse Trail (Optional)

class Mouse {
  constructor() {
    this.x = 0
    this.y = 0
  }

  update(x, y) {
    this.x = x
    this.y = y
  }
}
class Dot {
  constructor() {
    this.x = 0
    this.y = 0
    this.node = (function() {
      const n = document.createElement('div')
      n.className = 'trail'
      document.body.appendChild(n)
      return n
    })()
  }

  draw(x, y) {
    this.x = x
    this.y = y
    this.node.style.left = `${x}px`
    this.node.style.top = `${y}px`
  }
}

const mouse = new Mouse()
const dots = []
for (let i = 0; i < 12; i++) {
  dots.push(new Dot())
}

window.addEventListener('mousemove', ({ pageX, pageY }) => {
  mouse.update(pageX, pageY)
})

function draw() {
  let { x, y } = mouse
  dots.forEach((dot, index) => {
    dot.draw(x, y)
    const nextDot = dots[index + 1] || dots[0]
    x -= (x - nextDot.x) * 0.6
    y -= (y - nextDot.y) * 0.6
  })
}

function animate() {
  draw()
  requestAnimationFrame(animate)
}

animate()

// Tabs

function asTabs(node) {
  const tabs = Array.from(node.children).map(panel => {
    const button = document.createElement('button')
    button.textContent = panel.getAttribute('data-tabname')
    const tab = { panel, button }
    button.addEventListener('click', () => selectTab(tab))
    return tab
  })
  
  const tabList = document.createElement('div')
  for (const { button } of tabs) {
    tabList.appendChild(button)
  }
  node.insertBefore(tabList, node.firstChild)

  function selectTab(selectedTab) {
    for (const tab of tabs) {
      const selected = tab === selectedTab
      tab.button.style.color = selected ? 'red' : ''      
      tab.panel.style.display = selected ? '' : 'none'      
    }
  }
  selectTab(tabs[0])
}