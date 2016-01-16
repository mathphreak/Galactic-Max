/*global TRCGame, Phaser*/

TRCGame.loseState = {
  create: function () {
    var game = TRCGame.game
    var abusiveMessages = [
      'Get good',
      'Just uninstall'
    ]

    game.world.setBounds(0, 0, game.camera.width, game.camera.height)

    this.nameLabel = game.add.text(20, 20, 'You lose!',
            {font: '30px League Spartan', fill: '#ffffff'})
    this.failLabel = game.add.text(20, 90,
      abusiveMessages[Math.floor(Math.random() * abusiveMessages.length)],
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
