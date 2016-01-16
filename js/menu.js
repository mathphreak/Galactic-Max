/*global game, Phaser*/

var menuState = {
  create: function () {
    this.nameLabel = game.add.text(80, 80, 'TRC Hackathon Game',
            {font: '50px League Spartan', fill: '#ffffff'})
    this.startLabel = game.add.text(80, 360, 'Press Z to start',
            {font: '50px League Spartan', fill: '#ffffff'})

    var zKey = game.input.keyboard.addKey(Phaser.Keyboard.Z)

    zKey.onDown.addOnce(this.start, this)
  },

  start: function () {
    game.state.start('play')
  }
}
