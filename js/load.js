/*global TRCGame*/

TRCGame.loadState = {
  preload: function () {
    var game = TRCGame.game
    this.loadingLabel = game.add.text(20, 20, 'loading...',
      {font: '20px League Spartan', fill: '#ffffff'})

    game.load.audio('music', 'assets/Hackathon.wav')

    game.load.audio('sfx/shoot', 'assets/Laser_Shoot.wav')
    game.load.audio('sfx/shoot_rapidfire', 'assets/Laser_Shoot2.wav')
    game.load.audio('sfx/jump', 'assets/Jump.wav')
    game.load.audio('sfx/collect', 'assets/Pickup_Coin.wav')
    game.load.audio('sfx/powerup', 'assets/Powerup.wav')
    game.load.audio('sfx/hurt', 'assets/Hit_Hurt.wav')

    game.load.image('background_space', 'assets/Background-5.png')
    game.load.image('background_venus', 'assets/Planet_Background.png')
    game.load.image('background_mothership', 'assets/Mothership.png')

    game.load.image('platform_space', 'assets/Steel_Plating2.png')
    game.load.image('platform_venus', 'assets/Rocks.png')
    game.load.image('platform_mothership', 'assets/Mothership_Walkway.png')

    game.load.image('bullet', 'assets/Projectile.png')
    game.load.image('gasCan', 'assets/Gas_Canister.png')
    game.load.image('screwdriver', 'assets/Screwdriver.png')
    game.load.image('satellite', 'assets/Sat_Platform.png')

    game.load.image('upgrades/rapidfire', 'assets/Rapid_PwrUp.png')
    game.load.image('upgrades/trishot', 'assets/Trishot_PwrUp.png')
    game.load.image('upgrades/speedctl', 'assets/SpeedControl_PwrUp.png')
    game.load.image('selector', 'assets/Arrow.png')

    game.load.image('victory', 'assets/Victory_Screen.png')

    game.load.spritesheet('crashedSat', 'assets/Animated_CrashSat.png', 16, 16)
    game.load.spritesheet('max', 'assets/All.png', 16, 16)
    game.load.spritesheet('rocket', 'assets/Exploding_Rocket_Anim.png', 24, 32)
    game.load.spritesheet('alien', 'assets/Alien_Death-1.png', 8, 16)
    game.load.spritesheet('player_victory', 'assets/Sicem.png', 16, 32)
    game.load.spritesheet('spaceship', 'assets/Spaceship_Explode_Anim.png', 16, 24)
  },

  create: function () {
    TRCGame.game.state.start('menu')
  },

  render: TRCGame.mirrorCanvases
}
