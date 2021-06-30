function parseINI(string) {
  const result = {}
  let section = result // `section` points at the object for the current section (top-level by default)
  string.split(/\r?\n/).forEach(line => {
    let match
    if (match = line.match(/^(\w+)=(.*)$/)) {
      const [_, property, value] = match
      section[property] = value
    } else if (match = line.match(/^\[(.*)\]$/)) {
      section = result[match[1]] = {}
    } else if (!/^\s*(;.*)?$/.test(line)) {
      throw new Error(`Line '${line}' is not valid.`)
    }
  })
  return result
}

console.log(parseINI(`
searchengine=https://duckduckgo.com/?q=$1
spitefulness=9.7

; comments are preceded by a semicolon...
; each section concerns an individual enemy
[larry]
fullname=Larry Doe
type=kindergarten bully
website=http://www.geocities.com/CapeCanaveral/11451

[davaeorn]
fullname=Davaeorn
type=evil wizard
outputdir=/home/marijn/enemies/davaeorn
`))

// Regexp golf

verify(/ca[rt]/,
  ["my car", "bad cats"],
  ["camper", "high art"])

verify(/pr?op/,
  ["pop culture", "mad props"],
  ["plop", "prrrop"])

verify(/ferr(et|y|ari)/,
  ["ferret", "ferry", "ferrari"],
  ["ferrum", "transfer A"])

verify(/ious\b/,
  ["how delicious", "spacious room"],
  ["ruinous", "consciousness"])

verify(/\s[,.:;]/,
  ["bad punctuation ."],
  ["escape the period"])

verify(/\w{7}/,
  ["Siebentausenddreihundertzweiundzwanzig"],
  ["no", "three small words"])

verify(/\b[^\We]+\b/i,
  ["red platypus", "wobbling nest"],
  ["earth bed", "learnig ape", "BEET"])


function verify(regexp, yes, no) {
  for (const str of yes) if (!regexp.test(str)) {
    console.log(`Failure to match '${str}'`)
  }
  for (const str of no) if (regexp.test(str)) {
    console.log(`Unexpected match for '${str}'`)
  }
}

// Quoting style

const text = "'I'm the cook,' he said, 'it's my job.'"
console.log(text.replace(/(^|\W)'|'($|\W)/g, '$1"$2'))
// → "I'm the cook," he said, "it's my job."

// Numbers again

const number = /^[-+]?(\d+(\.\d*)?|\.\d+)(e[-+]?\d+)?$/i

for (const str of ["1", "-1", "+15", "1.55", ".5", "5.", "1.3e2", "1E-4", "1e+12"]) {
  if (!number.test(str)) {
    console.log(`Failed to match '${str}'`)
  }
}
for (const str of ["1a", "+-1", "1.2.3", "1+1", "1e4.5", ".5.", "1f5", "."]) {
  if (number.test(str)) {
    console.log(`Incorrectly accepted '${str}'`)
  }
}