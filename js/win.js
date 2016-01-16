/*global TRCGame, Phaser*/

TRCGame.winState = {
  create: function () {
    var game = TRCGame.game
    this.nameLabel = game.add.text(20, 20, 'You win!',
            {font: '30px League Spartan', fill: '#ffffff'})
    this.winLabel = game.add.text(20, 200, 'Press Z to restart',
            {font: '30px League Spartan', fill: '#ffffff'})

    var zKey = game.input.keyboard.addKey(Phaser.Keyboard.Z)

    zKey.onDown.addOnce(this.restart, this)
  },

  restart: function () {
    TRCGame.game.state.start('play')
  },

  render: TRCGame.mirrorCanvases
}
