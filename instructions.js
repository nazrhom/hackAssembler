module.exports = {
  AInstruction: function(label) {
    this.label = label
  },

  CInstruction: function(dest, comp, jump) {
    this.dest = dest
    this.comp = comp
    this.jump = jump
  },

  Label: function(name) {
    this.name = name
  },

  isAInstruction: function(string) {
    return /^@.+$/.test(string)
  },

  isLabel: function(string) {
    return /^\(.+\)$/.test(string)
  }
}
