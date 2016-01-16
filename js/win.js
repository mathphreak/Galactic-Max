/*global TRCGame, Phaser*/

TRCGame.winState = function (environment) {
  return {
    create: function () {
      var game = TRCGame.game

      game.world.setBounds(0, 0, game.camera.width, game.camera.height)

      this.nameLabel = game.add.text(20, 20, 'You win!',
        {font: '30px League Spartan', fill: '#ffffff'})
      this.gasLabel = game.add.text(20, 80,
        'Gas cans: ' + TRCGame.score.collectibles['gasCan'],
        {font: '20px League Spartan', fill: '#ffffff'})
      this.gasLabel = game.add.text(20, 120,
        'Screwdrivers: ' + TRCGame.score.collectibles['screwdriver'],
        {font: '20px League Spartan', fill: '#ffffff'})
      this.winLabel = game.add.text(20, 200, 'Press Z to continue',
        {font: '30px League Spartan', fill: '#ffffff'})

      var zKey = game.input.keyboard.addKey(Phaser.Keyboard.Z)

      zKey.onDown.addOnce(this.restart, this)
    },

    restart: function () {
      if (environment === 'space') {
        TRCGame.game.state.start('play_venus')
      } else if (environment === 'venus') {
        TRCGame.game.state.start('play_mothership')
      } else {
        TRCGame.game.state.start('final_victory')
      }
    },

    render: TRCGame.mirrorCanvases
  }
}
