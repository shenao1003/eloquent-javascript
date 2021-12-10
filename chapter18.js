// Text fields

const textarea = document.querySelector('textarea')

textarea.addEventListener('keydown', e => {
  if (e.key === 'F2') {
    replaceSelection(textarea, 'Khasekhemwy')
    e.preventDefault()
  }
})

function replaceSelection(field, word) {
  const { value, selectionStart, selectionEnd } = field
  const cursorPosition = selectionStart + word.length
  field.value = value.slice(0, selectionStart) + word + value.slice(selectionEnd)
  field.selectionStart = cursorPosition
  field.selectionEnd = cursorPosition
}

// Select fields

const select = document.querySelector('select')
const output = document.querySelector('#output')

select.addEventListener('change', () => {
  output.textContent = Array.from(select.options).filter(({ selected }) => selected).reduce((total, { value }) => total + Number(value), 0)
})

// File fields

function readFileText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result))
    reader.addEventListener('error', () => reject(reader.error))
    reader.readAsText(file)
  })
}

// Storing data client-side

const list = document.querySelector('select')
const note = document.querySelector('textarea')
const button = document.querySelector('button')

let state = {}
function setState(newState) {
  list.innerHTML = ''
  Object.keys(newState.notes).forEach(name => {
    const option = document.createElement('option')
    option.textContent = name
    if (name === newState.selected) {
      option.selected = true
    }
    list.appendChild(option)
  })
  note.value = newState.notes[newState.selected]
  
  localStorage.setItem('Notes', JSON.stringify(newState))
  state = newState
}

setState(JSON.parse(localStorage.getItem('Notes')) || {
  selected: 'shopping list',
  notes: { 'shopping list': 'Carrots\nRaisins' }
})

list.addEventListener('change', () => {
  setState({
    selected: list.value,
    notes: state.notes
  })
})
note.addEventListener('change', () => {
  setState({
    selected: state.selected,
    notes: Object.assign({}, state.notes, {
      [state.selected]: note.value
    })
  })
})
button.addEventListener('click', () => {
  const name = prompt('Note name')
  if (name) {
    setState({
      selected: name,
      notes: Object.assign({}, state.notes, {
        [name]: ''
      })
    })
  }
})

// Content negotiation

const url = 'https://eloquentjavascript.net/author'
const types = [
  'text/plain',
  'text/html',
  'application/json',
  'application/rainbows+unicorns'
]

async function showTypes() {
  for (const type of types) {
    const resp = await fetch(url, { headers: { accept: type } })
    console.log(`${type}:\n${await resp.text()}\n`)
  }
}

showTypes()

// A JavaScript workbench

const code = document.querySelector('#code')
const output = document.querySelector('#output')
const button = document.querySelector('#button')

button.addEventListener('click', () => {
  try {
    displayOutput(Function(code.value)())
  } catch (error) {
    displayOutput(error)
  }
})

function displayOutput(result) {
  output.textContent = result.toString()
}