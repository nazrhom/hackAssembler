var Instructions = require('./instructions')

function Parser(src) {
  this.src = src.split(/\n|\r/)
  .filter(function (elem) {
    return !/^\/\/.*|^$/.test(elem)
  })
  .map(function(elem) {return elem.replace(/\s|\/\/.+$/g, '').trim()})

  this.parsed = []
  this.curLine = 0
}

module.exports = Parser

Parser.prototype.preprocess = function (symbolTable) {
  var program = {
    AInstructions: [],
    CInstructions: [],
    Labels: []
  }

  var lineCounter = 0

  this.src.forEach(function (ln) {
    if(Instructions.isLabel(ln)) {
      program.Labels.push({text: ln, index: lineCounter})
    } else if (Instructions.isAInstruction(ln)) {
      program.AInstructions.push({text: ln, index: lineCounter++})
    } else {
      program.CInstructions.push({text: ln, index: lineCounter++})
    }
  })

  symbolTable.addLabels(program.Labels)

  this.src = symbolTable.translate(program)

  return
};

Parser.prototype.hasMoreCommands = function() {
  return !!this.src.length
}

Parser.prototype.advance = function() {
  return this.parse(this.src.shift())
}

Parser.prototype.parse = function(instruction) {
  if (Instructions.isAInstruction(instruction)) return new Instructions.AInstruction(instruction.slice(1))
  if (Instructions.isLabel(instruction)) return new Instructions.Label(instruction.slice(1, instruction.length - 1))
  else {
    var dest, comp, jump

    var destIndex = instruction.indexOf('=')
    var jumpIndex = instruction.indexOf(';')
    var isDest = destIndex !== -1
    var isJump = jumpIndex !== -1

    if (!isDest && !isJump) {
      comp = instruction
      dest = null
      jump = null
    } else if (isDest && !isJump) {
      comp = instruction.slice(destIndex + 1)
      dest = instruction.slice(0, destIndex)
      jump = null
    } else if (!isDest && isJump) {
      comp = instruction.slice(0, jumpIndex)
      dest = null
      jump = instruction.slice(jumpIndex + 1)
    } else {
      comp = instruction.slice(destIndex + 1, jumpIndex)
      dest = instruction.slice(0, destIndex)
      jump = instruction.slice(jumpIndex + 1)
    }

    return new Instructions.CInstruction(dest, comp, jump)
  }
}
