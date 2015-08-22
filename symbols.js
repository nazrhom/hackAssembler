var Instructions = require('./instructions')

function Table() {
  this.symbols = predefined
  this.nextFreeAddress = 16
}

module.exports = Table

var predefined = {
  "R0": 0,
  "R1": 1,
  "R2": 2,
  "R3": 3,
  "R4": 4,
  "R5": 5,
  "R6": 6,
  "R7": 7,
  "R8": 8,
  "R9": 9,
  "R10": 10,
  "R11": 11,
  "R12": 12,
  "R13": 13,
  "R14": 14,
  "R15": 15,
  "SCREEN": 16384,
  "KBD": 24576,
  "SP": 0,
  "LCL": 1,
  "ARG": 2,
  "THIS": 3,
  "THAT": 4,
}

Table.prototype.addLabels = function (lables) {
  lables.forEach(function (label) {
    this.symbols[label.text.slice(1, label.text.length - 1)] = label.index
  }, this)
}

Table.prototype.translate = function (program) {
  program.AInstructions = program.AInstructions.map(function(line) {
    if (/^@\d+$/.test(line.text)) return line
    else {
      var variable = line.text.slice(1)
      if (this.symbols[variable] === undefined) {
        this.symbols[variable] = this.nextFreeAddress++
      }
      return {text: '@' + this.symbols[variable], index: line.index}
    }
  }, this)

  var src = program.Labels.concat(program.AInstructions)
  .concat(program.CInstructions)
  .sort(function(a, b) {
    return a.index > b.index ? 1 : -1
  })
  .map(function(line) {
    return line.text
  })

  return src

}
