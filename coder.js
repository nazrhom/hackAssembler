var Instructions = require('./instructions')
var Tables = require('./tables')

function Coder() {}

module.exports = Coder

Coder.prototype.encode = function(instruction) {
  if (instruction instanceof Instructions.AInstruction) {
    return padZero(dec2bin(parseInt(instruction.label)), 16)
  } else if (instruction instanceof Instructions.CInstruction) {
    var dest = Tables.DEST[instruction.dest]
    var comp = Tables.COMP[instruction.comp]
    var jump = Tables.JUMP[instruction.jump]

    return '111' + comp + dest + jump
  } else {
    return null
  }
}

function dec2bin(dec) {
  return (dec >>> 0).toString(2)
}

function padZero(arg, len) {
  var zeroes = len - arg.length
  var padding = ''
  while (zeroes--) {
    padding = padding.concat('0')
  }
  return padding + arg
}
