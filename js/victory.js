/*global TRCGame*/

TRCGame.victoryState = {
  create: function () {
    var game = TRCGame.game

    game.world.setBounds(0, 0, game.camera.width, game.camera.height)

    this.victoryImage = game.add.sprite(0, 0, 'victory')
    this.player = game.add.sprite(0, 0, 'player_victory')
  },

  render: TRCGame.mirrorCanvases
}
