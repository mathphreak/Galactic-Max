/*global game, Phaser*/

var playState = {
  create: function () {
    game.renderer.renderSession.roundPixels = true
    game.stage.smoothed = false

    game.world.setBounds(0, 0, 9001, game.world.height)

    this.score = 0

    game.physics.startSystem(Phaser.Physics.ARCADE)

    this.background = game.add.tileSprite(0, 0, game.canvas.width, game.canvas.height, 'background')
    this.background.scale.setTo(2, 2)

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

    /*
    aliens.enableBody = true

    for (var j = 2; j < 5; j++) {
      var alien = aliens.create(j * 70, 200, 'alien')
      alien.scale.setTo(2, 2)
      alien.body.bounce.y = 0
      alien.body.gravity.y = 300
      alien.body.collideWorldBounds = true
    }
    */

    var bullets = game.add.group()
    this.bullets = bullets

    bullets.enableBody = true

    var uiLayer = game.add.group()
    uiLayer.classType = Phaser.Text
    uiLayer.fixedToCamera = true
    this.uiLayer = uiLayer

    this.scoreText = uiLayer.create(16, 16, 'Score: 0',
              {font: '10px League Spartan', fill: '#fff'})
  },

  update: function () {
    game.physics.arcade.collide(this.player, this.platforms)
    game.physics.arcade.collide(this.aliens, this.platforms)

    game.physics.arcade.overlap(this.bullets, this.aliens, this.killAlien, null, this)
    game.physics.arcade.overlap(this.bullets, this.platforms, this.killBullet, null, this)
    game.physics.arcade.overlap(this.player, this.aliens, this.lose, null, this)

    this.player.body.velocity.x = 150
    this.player.lastDirection = 1
    this.player.animations.play('right_move')

    if (this.keys.fire.isDown) {
      this.fire()
      this.player.animations.play('right_fire')
    }

    if (this.keys.jump.isDown && this.player.body.touching.down) {
      this.player.body.velocity.y = -300
    }

    this.background.x = this.camera.x
    this.background.tilePosition.setTo(this.camera.x * -0.25, this.camera.y)
  },

  killAlien: function (bullet, alien) {
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
      var bullet = this.bullets.create(this.player.x, this.player.y - 9, 'bullet')
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
