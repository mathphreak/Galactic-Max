/*global TRCGame, Phaser*/

TRCGame.playState = {
  create: function () {
    var game = TRCGame.game
    game.renderer.renderSession.roundPixels = true
    game.stage.smoothed = false

    game.world.setBounds(0, 0, 9001, game.world.height)

    this.score = {
      distance: 0,
      bonus: 0,
      total: function () {
        return this.distance + this.bonus
      }
    }

    game.physics.startSystem(Phaser.Physics.ARCADE)

    this.background = game.add.tileSprite(0, 0, game.canvas.width, game.canvas.height, 'background')

    var platforms = game.add.group()
    this.platforms = platforms

    platforms.enableBody = true
    for (var i = 0; i < game.width; i += 48) {
      var ground = platforms.create(i, game.world.height - 32, 'platform')
      ground.scale.setTo(2, 2)
      ground.body.immovable = true
    }

    // The player and its settings
    var player = game.add.sprite(32, game.world.height - 100, 'max')
    player.scale.setTo(2, 2)
    player.anchor.setTo(1, 0.5)
    this.player = player

    //  We need to enable physics on the player
    game.physics.arcade.enable(player)

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0
    player.body.gravity.y = 300
    player.body.collideWorldBounds = true

    // Follow the player with the camera
    this.game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER)

    //  Our animations
    player.animations.add('left_fire', [0], 10, false)
    player.animations.add('left_move', [1, 3, 2, 3], 10, true)
    player.animations.add('left_idle', [3], 10, true)
    player.animations.add('idle', [4], 10, true)
    player.animations.add('right_idle', [5], 10, true)
    player.animations.add('right_move', [6, 7, 5, 7], 10, true)
    player.animations.add('right_fire', [8], 10, false)

    this.keys = game.input.keyboard.createCursorKeys()
    this.keys.jump = game.input.keyboard.addKey(Phaser.Keyboard.Z)
    this.keys.fire = game.input.keyboard.addKey(Phaser.Keyboard.X)

    var aliens = game.add.group()
    this.aliens = aliens

    aliens.enableBody = true

    var bullets = game.add.group()
    this.bullets = bullets

    bullets.enableBody = true

    var uiLayer = game.add.group()
    uiLayer.classType = Phaser.Text
    uiLayer.fixedToCamera = true
    this.uiLayer = uiLayer

    this.scoreText = uiLayer.create(16, 16, 'Score: 0',
      {font: '10px League Spartan', fill: '#fff'})

    var gasCanScoreLayer = game.add.group(uiLayer)
    this.gasCanScoreLayer = gasCanScoreLayer

    this.collectibles = {
      gasCan: 0
    }

    var gasCans = game.add.group()
    this.gasCans = gasCans

    gasCans.enableBody = true
  },

  update: function () {
    var game = TRCGame.game

    game.physics.arcade.collide(this.player, this.platforms)
    game.physics.arcade.collide(this.aliens, this.platforms)

    game.physics.arcade.overlap(this.bullets, this.aliens, this.killAlien, null, this)
    game.physics.arcade.overlap(this.bullets, this.platforms, this.killBullet, null, this)
    game.physics.arcade.overlap(this.player, this.aliens, this.lose, null, this)
    game.physics.arcade.overlap(this.player, this.gasCans, this.collect, null, this)

    this.player.body.velocity.x = 150
    this.player.lastDirection = 1
    this.player.animations.play('right_move')

    if (this.keys.fire.isDown) {
      this.fire()
      this.player.animations.play('right_fire')
    }

    if (this.keys.jump.isDown && this.player.body.touching.down) {
      this.player.body.velocity.y = -200
    }

    this.background.x = this.camera.x
    this.background.tilePosition.setTo(this.camera.x * -0.25, this.camera.y)

    this.score.distance = Math.floor(this.player.x / 100)
    this.scoreText.text = 'Score: ' + this.score.total()

    if (this.camera.x + this.camera.width + 100 > this.latestPlatform().x) {
      this.generateNextSegment()
    }
  },

  generateNextSegment: function () {
    var startX = this.latestPlatform().x
    if (Math.random() < 0.25) {
      var wall = this.platforms.create(startX, TRCGame.game.world.height - 64, 'platform')
      wall.scale.setTo(2, 2)
      wall.body.immovable = true
    } else if (Math.random() < 0.25) {
      var alien = this.aliens.create(startX, 200, 'alien')
      alien.scale.setTo(2, 2)
      alien.body.bounce.y = 0
      alien.body.gravity.y = 300
      alien.body.collideWorldBounds = true
    }
    for (var i = startX; i < startX + 500; i += 48) {
      var ground = this.platforms.create(i, TRCGame.game.world.height - 32, 'platform')
      ground.scale.setTo(2, 2)
      ground.body.immovable = true
    }
    if (Math.random() < 0.25) {
      var gasCan = this.gasCans.create(startX + 200, TRCGame.game.world.height - 64, 'gasCan')
      gasCan.scale.setTo(2, 2)
    }
  },

  latestPlatform: function () {
    var platforms = this.platforms.children
    return platforms[platforms.length - 1]
  },

  killAlien: function (bullet, alien) {
    bullet.destroy()
    alien.destroy()

    this.score.bonus += 200
  },

  fire: function () {
    if (!this.fire.next || this.fire.next < Date.now()) {
      var bullet = this.bullets.create(this.player.x, this.player.y - 9, 'bullet')
      bullet.body.gravity.y = 0
      var sign = this.player.lastDirection
      bullet.body.velocity.x = 500 * sign
      bullet.scale.setTo(2 * sign, 2)
      bullet.events.onOutOfBounds.add(function () {
        bullet.destroy()
      }, this)
      this.fire.next = Date.now() + 250
    }
  },

  killBullet: function (bullet) {
    bullet.destroy()
  },

  collect: function (player, collectible) {
    collectible.destroy()
    this.collectibles[collectible.key]++
    this.score.bonus += 100
  },

  lose: function () {
    TRCGame.game.state.start('lose')
  },

  render: TRCGame.mirrorCanvases
}
