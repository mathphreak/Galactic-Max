/*global Phaser*/

var TRCGame = {}

TRCGame.pixel = {scale: 2, canvas: null, context: null, width: 0, height: 0}

TRCGame.mirrorCanvases = function () {
  TRCGame.pixel.context.drawImage(
    TRCGame.game.canvas,
    0,
    0,
    TRCGame.game.width,
    TRCGame.game.height,
    0,
    0,
    TRCGame.pixel.width,
    TRCGame.pixel.height
  )
}

TRCGame.bootState = {
  init: function () {
    TRCGame.game.canvas.style['display'] = 'none'

    TRCGame.pixel.canvas = Phaser.Canvas.create(
      TRCGame.game,
      TRCGame.game.width * TRCGame.pixel.scale,
      TRCGame.game.height * TRCGame.pixel.scale
    )

    TRCGame.pixel.context = TRCGame.pixel.canvas.getContext('2d')

    Phaser.Canvas.addToDOM(TRCGame.pixel.canvas)

    Phaser.Canvas.setSmoothingEnabled(TRCGame.pixel.context, false)

    TRCGame.pixel.width = TRCGame.pixel.canvas.width
    TRCGame.pixel.height = TRCGame.pixel.canvas.height
  },

  create: function () {
    TRCGame.game.physics.startSystem(Phaser.Physics.ARCADE)

    TRCGame.game.state.start('load')
  },

  render: TRCGame.mirrorCanvases
}
