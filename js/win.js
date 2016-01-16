/*global game, Phaser*/

var winState = {
  create: function () {
    this.nameLabel = game.add.text(80, 80, 'You win!',
            {font: '50px Junction', fill: '#ffffff'})
    this.winLabel = game.add.text(80, 360, 'Press Z to restart',
            {font: '50px Junction', fill: '#ffffff'})

    var zKey = game.input.keyboard.addKey(Phaser.Keyboard.Z)

    zKey.onDown.addOnce(this.restart, this)
  },

  restart: function () {
    game.state.start('play')
  }
}
