/*global game, Phaser*/

var win = {
  create: function () {
    this.nameLabel = game.add.text(80, 80, 'You win!',
            {font: '50px Junction', fill: '#ffffff'})
    this.start = game.add.text(80, 80, 'Press Z to restart',
            {font: '50px Junction', fill: '#ffffff'})

    var zKey = game.input.keyboard.addKey(Phaser.Keyboard.Z)

    zKey.onDown.addOnce(this.start, this)
  },

  start: function () {
    game.state.start('play')
  }
}
