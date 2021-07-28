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