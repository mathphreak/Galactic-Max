/*global TRCGame*/

TRCGame.victoryState = {
  create: function () {
    var game = TRCGame.game

    game.world.setBounds(0, 0, game.camera.width, game.camera.height)

    this.victoryImage = game.add.sprite(0, 0, 'victory')
    this.player = game.add.sprite(0, 0, 'player_victory')
    this.player.animations.add('sic-em', [
      0,
      1,
      2,
      1,
      0,
      1,
      2,
      1,
      0,
      1,
      2,
      1,
      0,
      1,
      2,
      1,
      0,
      3,
      4,
      3,
      2,
      1,
      0
    ], 10, false)
    this.player.animations.play('sic-em')
  },

  render: TRCGame.mirrorCanvases
}
