/*global  game*/

var loadState = {
  preload: function () {
    this.loadingLabel = game.add.text(20, 20, 'loading...',
          {font: '20px League Spartan', fill: '#ffffff'})

    game.load.image('background', 'assets/Background-1.png')
    game.load.image('bullet', 'assets/Projectile.png')
    game.load.image('platform', 'assets/Sat_Platform.png')
    // game.load.image('alien', 'assets/Alien.png')
    game.load.spritesheet('max', 'assets/All.png', 16, 16)
  },

  create: function () {
    game.state.start('menu')
  },

  render: mirrorCanvases
}
