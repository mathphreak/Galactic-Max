/*global TRCGame*/

TRCGame.loadState = {
  preload: function () {
    var game = TRCGame.game
    this.loadingLabel = game.add.text(20, 20, 'loading...',
          {font: '20px League Spartan', fill: '#ffffff'})

    game.load.image('background_space', 'assets/Background-5.png')
    game.load.image('background_venus', 'assets/Planet_Background.png')
    game.load.image('background_mothership', 'assets/Mothership.png')
    game.load.image('bullet', 'assets/Projectile.png')
    game.load.image('platform', 'assets/Steel_Plating2.png')
    game.load.image('gasCan', 'assets/Gas_Canister.png')
    game.load.image('screwdriver', 'assets/Screwdriver.png')
    game.load.image('satellite', 'assets/Sat_Platform.png')
    game.load.spritesheet('crashedSat', 'assets/Animated_CrashSat.png', 16, 16)
    game.load.spritesheet('max', 'assets/All.png', 16, 16)
    game.load.spritesheet('rocket', 'assets/Exploding_Rocket_Anim.png', 24, 32)
    game.load.spritesheet('alien', 'assets/Alien_Death-1.png', 8, 16)
  },

  create: function () {
    TRCGame.game.state.start('menu')
  },

  render: TRCGame.mirrorCanvases
}
