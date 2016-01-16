/*global Phaser*/

var GalacticMax = {}

GalacticMax.pixel = {scale: 2, canvas: null, context: null, width: 0, height: 0}

GalacticMax.mirrorCanvases = function () {
  GalacticMax.pixel.context.drawImage(
    GalacticMax.game.canvas,
    0,
    0,
    GalacticMax.game.width,
    GalacticMax.game.height,
    0,
    0,
    GalacticMax.pixel.width,
    GalacticMax.pixel.height
  )
}

GalacticMax.bootState = {
  init: function () {
    GalacticMax.game.canvas.style['display'] = 'none'

    GalacticMax.pixel.canvas = Phaser.Canvas.create(
      GalacticMax.game,
      GalacticMax.game.width * GalacticMax.pixel.scale,
      GalacticMax.game.height * GalacticMax.pixel.scale
    )

    GalacticMax.pixel.context = GalacticMax.pixel.canvas.getContext('2d')

    Phaser.Canvas.addToDOM(GalacticMax.pixel.canvas)

    Phaser.Canvas.setSmoothingEnabled(GalacticMax.pixel.context, false)

    GalacticMax.pixel.width = GalacticMax.pixel.canvas.width
    GalacticMax.pixel.height = GalacticMax.pixel.canvas.height
  },

  create: function () {
    GalacticMax.game.physics.startSystem(Phaser.Physics.ARCADE)

    GalacticMax.game.state.start('load')
  },

  render: GalacticMax.mirrorCanvases
}
