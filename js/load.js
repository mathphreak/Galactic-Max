/*global  game*/

var loadState = {
  preload: function () {
    this.loadingLabel = game.add.text(20, 20, 'loading...',
          {font: '20px League Spartan', fill: '#ffffff'})

    game.load.image('sky', 'assets/tutorial_sky.png')
    game.load.image('bullet', 'assets/Projectile.png')
    game.load.image('platform', 'assets/Sat_Platform.png')
    game.load.image('alien', 'assets/Alien.png')
    game.load.spritesheet('dude', 'assets/tutorial_dude.png', 32, 48)
  },

  create: function () {
    game.state.start('menu')
  },

  render: mirrorCanvases
}
