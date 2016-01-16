/*global GalacticMax*/

GalacticMax.victoryState = {
  create: function () {
    var game = GalacticMax.game

    game.world.setBounds(0, 0, game.camera.width, game.camera.height)

    this.victoryImage = game.add.sprite(0, 0, 'victory')
    this.player = game.add.sprite(100, 200, 'player_victory')
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
    ], 10, true)
    this.player.animations.play('sic-em')

    this.thanks = game.add.text(20, 250, 'Thanks for Playing',
      {font: '20px League Spartan', fill: '#fff'})
  },

  render: GalacticMax.mirrorCanvases
}
