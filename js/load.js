/*global TRCGame*/

TRCGame.loadState = {
  preload: function () {
    var game = TRCGame.game
    this.loadingLabel = game.add.text(20, 20, 'loading...',
          {font: '20px League Spartan', fill: '#ffffff'})

    game.load.image('background', 'assets/Background-5.png')
    game.load.image('bullet', 'assets/Projectile.png')
    game.load.image('platform', 'assets/Steel_Plating.png')
    game.load.image('alien', 'assets/Alien.png')
    game.load.image('gasCan', 'assets/Gas_Canister.png')
    game.load.image('crashedSat', 'assets/Crashed_sat.png')
    game.load.spritesheet('max', 'assets/All.png', 16, 16)
  },

  create: function () {
    TRCGame.game.state.start('menu')
  },

  render: TRCGame.mirrorCanvases
}
