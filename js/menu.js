/*global GalacticMax, Phaser*/

GalacticMax.menuState = {
  create: function () {
    var game = GalacticMax.game
    this.nameLabel = game.add.text(20, 20, 'Galactic Max',
      {font: '30px League Spartan', fill: '#ffffff'})
    this.controls = game.add.text(20, 150, 'Z to jump, X to shoot',
      {font: '20px League Spartan', fill: '#ffffff'})
    this.startLabel = game.add.text(20, 200, 'Press Z to start',
      {font: '30px League Spartan', fill: '#ffffff'})

    var zKey = game.input.keyboard.addKey(Phaser.Keyboard.Z)

    zKey.onDown.addOnce(this.start, this)
  },

  start: function () {
    GalacticMax.game.state.start('play_space')
  },

  render: GalacticMax.mirrorCanvases
}
