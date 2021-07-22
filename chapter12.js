// Parsing

function parseExpression(program) {
  program = skipSpace(program)
  let match, expr
  if (match = /^"([^"]*)"/.exec(program)) {
    expr = { type: 'value', value: match[1] }
  } else if (match = /^\d+\b/.exec(program)) {
    expr = { type: 'value', value: Number(match[0]) }
  } else if (match = /^[^\s(),#"]+/.exec(program)) {
    expr = { type: 'word', name: match[0] }
  } else {
    throw new SyntaxError(`Unexpected syntax: ${program}`)
  }

  return parseApply(expr, program.slice(match[0].length))
}

function skipSpace(string) {
  const first = string.search(/\S/)
  return first === -1 ? '' : string.slice(first)
}

function parseApply(expr, program) {
  program = skipSpace(program)
  if (program[0] !== '(') {
    return { expr, rest: program }
  }

  program = skipSpace(program.slice(1))
  expr = { type: 'apply', operator: expr, args: [] }
  while (program[0] !== ')') {
    const arg = parseExpression(program)
    expr.args.push(arg.expr)
    program = skipSpace(arg.rest)
    if (program[0] === ',') {
      program = skipSpace(program.slice(1))
    } else if (program[0] !== ')') {
      throw new SyntaxError("Expected ',' or ')'")
    }
  }
  return parseApply(expr, program.slice(1))
}

function parse(program) {
  const { expr, rest } = parseExpression(program)
  if (skipSpace(rest).length) {
    throw new SyntaxError('Unexpected text after program')
  }
  return expr
}

// The evaluator

const specialForms = Object.create(null)

function evaluate({ type, value, name, operator, args }, scope) {
  if (type === 'value') {
    return value
  } else if (type === 'word') {
    if (name in scope) {
      return scope[name]
    }
    throw new ReferenceError(`Undefined binding: ${name}`)
  } else if (type === 'apply') {
    if (operator.type === 'word' && operator.name in specialForms) {
      return specialForms[operator.name](args, scope)
    }
    const op = evaluate(operator, scope)
    if (typeof op === 'function') {
      return op(...args.map(arg => evaluate(arg, scope)))
    }
    throw new TypeError('Applying a non-function.')
  }
}

// Special forms

specialForms.if = (args, scope) => {
  if (args.length !== 3) {
    throw new SyntaxError('Wrong number of args to if')
  }
  const [condition, a, b] = args
  return evaluate(condition, scope) !== false
    ? evaluate(a, scope)
    : evaluate(b, scope)
}

specialForms.while = (args, scope) => {
  if (args.length !== 2) {
    throw new SyntaxError('Wrong number of args to while')
  }
  const [condition, body] = args
  while (evaluate(condition, scope) !== false) {
    evaluate(body, scope)
  }
  return false
}

specialForms.do = (args, scope) => {
  let value = false
  for (const arg of args) {
    value = evaluate(arg, scope)
  }
  return value
}

specialForms.define = (args, scope) => {
  if (args.length !== 2 || args[0].type !== 'word') {
    throw new SyntaxError('Incorrect use of define')
  }
  return scope[args[0].name] = evaluate(args[1], scope)
}

// The environment

const topScope = Object.create(null)

topScope.true = true
topScope.false = false

for (const op of ['+', '-', '*', '/', '==', '<', '>']) {
  topScope[op] = Function('a, b', `return a ${op} b`)
}

topScope.print = value => {
  console.log(value)
  return value
}

function run(program) {
  return evaluate(parse(program), Object.create(topScope))
}

// Functions

specialForms.fun = (args, scope) => {
  if (!args.length) {
    throw new SyntaxError('Functions need a body')
  }

  const body = args[args.length - 1]
  const params = args.slice(0, args.length - 1).map(({ type, name }) => {
    if (type !== 'word') {
      throw new SyntaxError('Parameter names must be words')
    }
    return name
  })

  return function() {
    if (arguments.length !== params.length) {
      throw new TypeError('Wrong number of arguments')
    }

    const localScope = Object.create(scope)
    params.forEach((name, index) => {
      localScope[name] = arguments[index]
    })
    return evaluate(body, localScope)
  }
}

// Arrays

topScope.array = (...values) => values

topScope.length = array => array.length

topScope.element = (array, i) => array[i]

run(`
do(define(sum, fun(array,
     do(define(i, 0),
        define(sum, 0),
        while(<(i, length(array)),
          do(define(sum, +(sum, element(array, i))),
             define(i, +(i, 1)))),
        sum))),
   print(sum(array(1, 2, 3))))
`)
// → 6

// Comments

function skipSpace(string) {
  const skippable = string.match(/^(\s|#.*)*/)
  return string.slice(skippable[0].length)
}

console.log(parse("# hello\nx"))
// → {type: "word", name: "x"}

console.log(parse("a # one\n   # two\n()"))
// → {type: "apply",
//    operator: {type: "word", name: "a"},
//    args: []}

// Fixing scope

specialForms.set = (args, env) => {
  if (args.length !== 2 || args[0].type !== 'word') {
    throw new SyntaxError('Bad use of set')
  }

  const varName = args[0].name
  const value = evaluate(args[1], env)
  for (let scope = env; scope; scope = Object.getPrototypeOf(scope)) {
    if (Object.prototype.hasOwnProperty.call(scope, varName)) {
      return scope[varName] = value
    }
  }
  throw new ReferenceError(`Setting undefined variable ${varName}`)
}

run(`
do(define(x, 4),
   define(setx, fun(val, set(x, val))),
   setx(50),
   print(x))
`)
// → 50
run(`set(quux, true)`)
// → Some kind of ReferenceError