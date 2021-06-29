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