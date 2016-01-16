/*global TRCGame, Phaser*/

TRCGame.playState = function (environment) {
  return {
    create: function () {
      var game = TRCGame.game
      game.renderer.renderSession.roundPixels = true
      game.stage.smoothed = false

      if (environment === 'space') {
        TRCGame.score = {
          distance: 0,
          bonus: 0,
          total: function () {
            return this.distance + this.bonus
          },
          collectibles: {
            gasCan: 0,
            screwdriver: 0
          }
        }
      } else {
        TRCGame.score.collectibles.gasCan -= 5
      }

      game.physics.startSystem(Phaser.Physics.ARCADE)

      this.background = game.add.tileSprite(0, 0,
        game.canvas.width, game.canvas.height, 'background_' + environment)

      var platforms = game.add.group()
      this.platforms = platforms

      platforms.enableBody = true
      for (var i = 0; i < game.width; i += 48) {
        var ground = platforms.create(i, game.world.height - 32, 'platform')
        ground.scale.setTo(2, 2)
        ground.body.immovable = true
      }

      // The player and its settings
      var player = game.add.sprite(0, game.world.height - 48, 'max')
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
      this.game.camera.deadzone.x = game.canvas.width / 6
      this.game.camera.deadzone.width = game.canvas.width / 6

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

      var rockets = game.add.group()
      this.rockets = rockets
      rockets.enableBody = true

      var uiLayer = game.add.group()
      uiLayer.classType = Phaser.Text
      uiLayer.fixedToCamera = true
      this.uiLayer = uiLayer

      this.scoreText = uiLayer.create(16, 16, 'Score: 0',
        {font: '10px League Spartan', fill: '#fff'})

      var gasCanScoreLayer = game.add.group(uiLayer)
      this.gasCanScoreLayer = gasCanScoreLayer

      var screwdriverScoreLayer = game.add.group(uiLayer)
      this.screwdriverScoreLayer = screwdriverScoreLayer

      var gasCans = game.add.group()
      this.gasCans = gasCans
      gasCans.enableBody = true

      var screwdrivers = game.add.group()
      this.screwdrivers = screwdrivers
      screwdrivers.enableBody = true
    },

    update: function () {
      var game = TRCGame.game

      game.physics.arcade.collide(this.player, this.platforms, this.checkWall, null, this)
      game.physics.arcade.collide(this.aliens, this.platforms)

      game.physics.arcade.overlap(this.bullets, this.aliens, this.killAlien, null, this)
      game.physics.arcade.overlap(this.bullets, this.platforms, this.killBullet, null, this)
      game.physics.arcade.overlap(this.bullets, this.rockets, this.killRocket, null, this)
      game.physics.arcade.overlap(this.player, this.aliens, this.lose, null, this)
      game.physics.arcade.overlap(this.player, this.gasCans, this.collect, null, this)
      game.physics.arcade.overlap(this.player, this.screwdrivers, this.collect, null, this)
      game.physics.arcade.overlap(this.player, this.rockets, this.enterRocket, null, this)

      this.player.body.velocity.x = 150
      this.player.lastDirection = 1
      this.player.animations.play('right_move')

      if (this.keys.fire.isDown) {
        this.fire()
        this.player.animations.play('right_fire')
      }

      if (this.keys.jump.isDown && this.player.body.touching.down) {
        this.player.body.velocity.y = -250
      }

      this.background.x = this.camera.x
      this.background.tilePosition.setTo(this.camera.x * -0.25, this.camera.y)

      TRCGame.score.distance = Math.floor(this.player.x / 100)
      this.scoreText.text = 'Score: ' + TRCGame.score.total()

      if (this.player.alive) {
        if (this.camera.x + this.camera.width + 100 > this.latestPlatform().x) {
          this.generateNextSegment()
        }
      }
    },

    checkWall: function (player, platform) {
      var angle = this.game.physics.arcade.angleBetween(player, platform)
      if (angle === -0.5 * Math.PI) {
        this.lose()
      }
    },

    generateNextSegment: TRCGame.generateNextSegment,

    latestPlatform: function () {
      var platforms = this.platforms.children
      return platforms[platforms.length - 1]
    },

    killAlien: function (bullet, alien) {
      if (alien.alive) {
        bullet.destroy()
        alien.alive = false
        alien.animations.play('die')

        TRCGame.score.bonus += 200
      }
    },

    killRocket: function (bullet, rocket) {
      if (rocket.alive) {
        bullet.destroy()
        rocket.alive = false
        rocket.animations.play('explode')
      }
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
      bullet.parent.remove(bullet, false)
      bullet.pendingDestroy = true
    },

    collect: function (player, collectible) {
      collectible.destroy()
      TRCGame.score.collectibles[collectible.key]++
      TRCGame.score.bonus += 100

      if (this.gasCanScoreLayer.total < TRCGame.score.collectibles['gasCan']) {
        var xOffset = this.gasCanScoreLayer.total * 8
        var can = this.gasCanScoreLayer.create(this.game.canvas.width - xOffset, 0, 'gasCan')
        can.anchor.setTo(1, 0)
      }

      if (this.screwdriverScoreLayer.total < TRCGame.score.collectibles['screwdriver']) {
        var xOffset2 = this.screwdriverScoreLayer.total * 8
        var screwdriver = this.screwdriverScoreLayer.create(this.game.canvas.width - xOffset2, 8, 'screwdriver')
        screwdriver.anchor.setTo(1, 0)
      }
    },

    enterRocket: function (player, rocket) {
      if (rocket.alive) {
        this.win()
      }
    },

    win: function () {
      this.player.kill()
      TRCGame.game.state.start('win_' + environment)
    },

    lose: function () {
      this.player.kill()
      TRCGame.game.state.start('lose')
    },

    render: TRCGame.mirrorCanvases
  }
}
