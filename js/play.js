/*global game, Phaser*/

var playState = {
  create: function () {
    game.renderer.renderSession.roundPixels = true
    game.stage.smoothed = false

    this.score = 0

    game.physics.startSystem(Phaser.Physics.ARCADE)

    game.add.sprite(0, 0, 'sky')

    var platforms = game.add.group()
    this.platforms = platforms

    platforms.enableBody = true
    for (var i = 0; i < game.width; i += 48) {
      var ground = platforms.create(i, game.world.height - 32, 'platform')
      ground.scale.setTo(2, 2)
      ground.body.immovable = true
    }

    /*
    var ledge = platforms.create(400, 400, 'ground')

    ledge.body.immovable = true

    ledge = platforms.create(-150, 250, 'ground')

    ledge.body.immovable = true
    */

    // The player and its settings
    var player = game.add.sprite(32, game.world.height - 150, 'dude')
    this.player = player

    //  We need to enable physics on the player
    game.physics.arcade.enable(player)

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0
    player.body.gravity.y = 300
    player.body.collideWorldBounds = true

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true)
    player.animations.add('right', [5, 6, 7, 8], 10, true)

    this.keys = game.input.keyboard.createCursorKeys()
    this.keys.jump = game.input.keyboard.addKey(Phaser.Keyboard.Z)
    this.keys.fire = game.input.keyboard.addKey(Phaser.Keyboard.X)

    var aliens = game.add.group()
    this.aliens = aliens

    aliens.enableBody = true

    for (var j = 2; j < 5; j++) {
      var alien = aliens.create(j * 70, 0, 'alien')
      alien.scale.setTo(2, 2)
      alien.body.bounce.y = 0
      alien.body.gravity.y = 300
      alien.body.collideWorldBounds = true
    }

    var bullets = game.add.group()
    this.bullets = bullets

    bullets.enableBody = true

    this.scoreText = game.add.text(16, 16, 'Score: 0',
              {font: '10px League Spartan', fill: '#000'})
  },

  update: function () {
    game.physics.arcade.collide(this.player, this.platforms)

    this.player.body.velocity.x = 0

    if (this.keys.left.isDown) {
      this.player.body.velocity.x = -150
      this.player.lastDirection = -1
      this.player.animations.play('left')
    } else if (this.keys.right.isDown) {
      this.player.body.velocity.x = 150
      this.player.lastDirection = 1
      this.player.animations.play('right')
    } else {
      this.player.animations.stop()
      this.player.frame = 4
    }

    if (this.keys.fire.isDown) {
      this.fire()
    }

    if (this.keys.jump.isDown && this.player.body.touching.down) {
      this.player.body.velocity.y = -300
    }

    game.physics.arcade.collide(this.aliens, this.platforms)

    game.physics.arcade.overlap(this.bullets, this.aliens, this.collectStar, null, this)
    game.physics.arcade.overlap(this.bullets, this.platforms, this.killBullet, null, this)
    game.physics.arcade.overlap(this.player, this.aliens, this.lose, null, this)
  },

  collectStar: function (bullet, alien) {
    bullet.kill()
    alien.kill()

    this.score += 10
    this.scoreText.text = 'Score: ' + this.score

    if (this.aliens.total === 0) {
      game.state.start('win')
    }
  },

  fire: function () {
    if (!this.fire.next || this.fire.next < Date.now()) {
      var bullet = this.bullets.create(this.player.x, this.player.y + 10, 'bullet')
      bullet.body.gravity.y = 0
      var sign = this.player.lastDirection
      bullet.body.velocity.x = 500 * sign
      bullet.scale.setTo(2 * sign, 2)
      bullet.events.onOutOfBounds.add(function () {
        bullet.kill()
      }, this)
      this.fire.next = Date.now() + 250
    }
  },

  killBullet: function (bullet) {
    bullet.kill()
  },

  lose: function () {
    game.state.start('lose')
  },

  render: mirrorCanvases
}
