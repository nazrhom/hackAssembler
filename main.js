var Coder = require('./coder')
var Parser = require('./parser')
var Symbols = require('./symbols')

var symbolTable = new Symbols()

var fs = require('fs')
var path = require('path')

var file = process.argv[2]

var src = fs.readFileSync(file, 'utf8')

var p = new Parser(src)
var c = new Coder()

var program = []

p.preprocess(symbolTable)

// second pass
while (p.hasMoreCommands()) {
  var nextLine = c.encode(p.advance())
  if (nextLine !== null) program.push(nextLine)
}

var out = fs.createWriteStream(path.basename(file, 'asm') + 'hack')

program.forEach(function (line) {
  out.write(line + '\n')
})
