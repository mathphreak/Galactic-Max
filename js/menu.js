/*global TRCGame, Phaser*/

TRCGame.menuState = {
  create: function () {
    var game = TRCGame.game
    this.nameLabel = game.add.text(20, 20, 'TRC Hackathon\nGame',
            {font: '30px League Spartan', fill: '#ffffff'})
    this.startLabel = game.add.text(20, 200, 'Press Z to start',
            {font: '30px League Spartan', fill: '#ffffff'})

    var zKey = game.input.keyboard.addKey(Phaser.Keyboard.Z)

    zKey.onDown.addOnce(this.start, this)
  },

  start: function () {
    TRCGame.game.state.start('play_space')
  },

  render: TRCGame.mirrorCanvases
}
