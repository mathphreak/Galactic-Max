/*global GalacticMax, Phaser*/

GalacticMax.playState = function (environment) {
  return {
    create: function () {
      var game = GalacticMax.game
      game.renderer.renderSession.roundPixels = true
      game.stage.smoothed = false

      game.sound.play('music', 1, true)

      if (environment === 'space') {
        GalacticMax.score = {
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

        GalacticMax.upgrades = {
          rapidfire: false,
          trishot: false,
          speed_control: false
        }
      } else {
        GalacticMax.score.collectibles.gasCan -= 5
      }

      game.physics.startSystem(Phaser.Physics.ARCADE)

      this.background = game.add.tileSprite(0, 0,
        game.canvas.width, game.canvas.height, 'background_' + environment)

      var platforms = game.add.group()
      this.platforms = platforms

      platforms.enableBody = true
      for (var i = 0; i < 240; i += 48) {
        var ground = platforms.create(i, game.world.height - 32, 'platform_' + environment)
        ground.scale.setTo(2, 2)
        ground.body.immovable = true
      }
      this.nextStartX = 240

      var harmlessPlatforms = game.add.group()
      this.harmlessPlatforms = harmlessPlatforms
      harmlessPlatforms.enableBody = true

      var dangerPlatforms = game.add.group()
      this.dangerPlatforms = dangerPlatforms
      dangerPlatforms.enableBody = true

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

      var spaceships = game.add.group()
      this.spaceships = spaceships
      spaceships.enableBody = true

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

      this.updateScoreIcons()
    },

    update: function () {
      var game = GalacticMax.game

      game.physics.arcade.collide(this.player, this.harmlessPlatforms)
      game.physics.arcade.collide(this.player, this.platforms, this.checkWall, null, this)
      game.physics.arcade.collide(this.player, this.dangerPlatforms, this.lose, null, this)
      game.physics.arcade.collide(this.aliens, this.harmlessPlatforms)
      game.physics.arcade.collide(this.aliens, this.platforms)
      game.physics.arcade.collide(this.aliens, this.dangerPlatforms)
      game.physics.arcade.collide(this.spaceships, this.harmlessPlatforms)
      game.physics.arcade.collide(this.spaceships, this.platforms)
      game.physics.arcade.collide(this.spaceships, this.dangerPlatforms)

      game.physics.arcade.overlap(this.bullets, this.aliens, this.killAlien, null, this)
      game.physics.arcade.overlap(this.bullets, this.spaceships, this.killAlien, null, this)
      game.physics.arcade.overlap(this.bullets, this.dangerPlatforms, this.killBullet, null, this)
      game.physics.arcade.overlap(this.bullets, this.platforms, this.killBullet, null, this)
      game.physics.arcade.overlap(this.bullets, this.harmlessPlatforms, this.killBullet, null, this)
      game.physics.arcade.overlap(this.bullets, this.rockets, this.killRocket, null, this)
      game.physics.arcade.overlap(this.player, this.aliens, this.checkAlien, null, this)
      game.physics.arcade.overlap(this.player, this.spaceships, this.checkAlien, null, this)
      game.physics.arcade.overlap(this.player, this.gasCans, this.collect, null, this)
      game.physics.arcade.overlap(this.player, this.screwdrivers, this.collect, null, this)
      game.physics.arcade.overlap(this.player, this.rockets, this.enterRocket, null, this)

      this.player.body.velocity.x = 150
      this.player.lastDirection = 1
      this.player.animations.play('right_move')

      if (GalacticMax.upgrades.speed_control) {
        if (this.keys.right.isDown) {
          this.player.body.velocity.x += 50
        }
        if (this.keys.left.isDown) {
          this.player.body.velocity.x -= 50
        }
      }

      if (this.keys.fire.isDown) {
        this.fire()
        this.player.animations.play('right_fire')
      }

      if (this.keys.jump.isDown && this.player.body.touching.down) {
        this.player.body.velocity.y = -205
        game.sound.play('sfx/jump')
      }

      this.background.x = this.camera.x
      this.background.tilePosition.setTo(this.camera.x * -0.25, this.camera.y)

      GalacticMax.score.distance = Math.floor(this.player.x / 100)
      this.scoreText.text = 'Score: ' + GalacticMax.score.total()

      if (this.player.alive) {
        if (this.camera.x + this.camera.width + 100 > this.nextStartX) {
          this.generateNextSegment()
        }
      }

      if (GalacticMax.DEMO) {
        if (this.keys.up.isDown && !this.keys.upBlocked) {
          this.keys.upBlocked = true
          GalacticMax.score.collectibles.gasCan++
          this.updateScoreIcons()
        } else if (!this.keys.up.isDown) {
          this.keys.upBlocked = false
        }

        if (this.keys.down.isDown && !this.keys.downBlocked) {
          this.keys.downBlocked = true
          GalacticMax.score.collectibles.screwdriver++
          this.updateScoreIcons()
        } else if (!this.keys.down.isDown) {
          this.keys.downBlocked = false
        }
      }
    },

    checkWall: function (player, platform) {
      var angle = this.game.physics.arcade.angleBetween(player, platform)
      if (angle === -0.5 * Math.PI) {
        this.lose()
      }
    },

    checkAlien: function (player, alien) {
      if (alien.alive) {
        this.lose()
      }
    },

    lastDangerPlatform: function () {
      var platforms = this.dangerPlatforms.children
      return platforms[platforms.length - 1]
    },

    lastHarmlessPlatform: function () {
      var platforms = this.harmlessPlatforms.children
      return platforms[platforms.length - 1]
    },

    generateNextSegment: GalacticMax.generateNextSegment(environment),

    killAlien: function (bullet, alien) {
      if (alien.alive) {
        this.killBullet(bullet)
        alien.alive = false
        alien.animations.play('die')

        GalacticMax.score.bonus += 200
      }
    },

    killRocket: function (bullet, rocket) {
      if (rocket.alive) {
        this.killBullet(bullet)
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
        if (GalacticMax.upgrades.trishot) {
          var high_bullet = this.bullets.create(this.player.x, this.player.y - 9, 'bullet')
          high_bullet.body.gravity.y = 0
          high_bullet.body.velocity.x = 500 * sign
          high_bullet.body.velocity.y = -100
          high_bullet.scale.setTo(2 * sign, 2)
          high_bullet.events.onOutOfBounds.add(function () {
            high_bullet.destroy()
          }, this)
          var low_bullet = this.bullets.create(this.player.x, this.player.y - 9, 'bullet')
          low_bullet.body.gravity.y = 0
          low_bullet.body.velocity.x = 500 * sign
          low_bullet.body.velocity.y = 100
          low_bullet.scale.setTo(2 * sign, 2)
          low_bullet.events.onOutOfBounds.add(function () {
            low_bullet.destroy()
          }, this)
        }
        if (GalacticMax.upgrades.rapidfire) {
          this.game.sound.play('sfx/shoot_rapidfire')
          this.fire.next = Date.now() + 100
        } else {
          this.game.sound.play('sfx/shoot')
          this.fire.next = Date.now() + 500
        }
      }
    },

    killBullet: function (bullet) {
      if (bullet.alive) {
        bullet.parent.remove(bullet, false)
        bullet.pendingDestroy = true
        bullet.alive = false
      }
    },

    collect: function (player, collectible) {
      collectible.destroy()
      GalacticMax.score.collectibles[collectible.key]++
      GalacticMax.score.bonus += 100

      this.updateScoreIcons()

      this.game.sound.play('sfx/collect')
    },

    updateScoreIcons: function () {
      while (this.gasCanScoreLayer.total < GalacticMax.score.collectibles['gasCan']) {
        var xOffset = this.gasCanScoreLayer.total * 8
        var can = this.gasCanScoreLayer.create(this.game.canvas.width - xOffset, 0, 'gasCan')
        can.anchor.setTo(1, 0)
      }

      while (this.screwdriverScoreLayer.total < GalacticMax.score.collectibles['screwdriver']) {
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
      GalacticMax.game.state.start('win_' + environment)
    },

    lose: function () {
      this.player.kill()
      this.game.sound.play('sfx/hurt')
      GalacticMax.game.state.start('lose')
    },

    render: GalacticMax.mirrorCanvases
  }
}
