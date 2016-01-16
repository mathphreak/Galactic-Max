/*global Phaser, game*/

var pixel = {scale: 2, canvas: null, context: null, width: 0, height: 0}

var bootState = {
  init: function () {
    game.canvas.style['display'] = 'none'

    pixel.canvas = Phaser.Canvas.create(
      game,
      game.width * pixel.scale,
      game.height * pixel.scale
    )

    pixel.context = pixel.canvas.getContext('2d')

    Phaser.Canvas.addToDOM(pixel.canvas)

    Phaser.Canvas.setSmoothingEnabled(pixel.context, false)

    pixel.width = pixel.canvas.width
    pixel.height = pixel.canvas.height
  },

  create: function () {
    game.physics.startSystem(Phaser.Physics.ARCADE)

    game.state.start('load')
  },

  render: mirrorCanvases
}

function mirrorCanvases () {
  pixel.context.drawImage(game.canvas, 0, 0, game.width, game.height, 0, 0, pixel.width, pixel.height)
}
