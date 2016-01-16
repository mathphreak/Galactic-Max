/*global game, Phaser*/

var playState = {
  create: function () {
    // game.renderer.renderSession.roundPixels = true

    this.score = 0

    game.physics.startSystem(Phaser.Physics.ARCADE)

    game.add.sprite(0, 0, 'sky')

    var platforms = game.add.group()
    this.platforms = platforms

    platforms.enableBody = true

    var ground = platforms.create(0, game.world.height - 64, 'ground')

    ground.scale.setTo(2, 2)

    ground.body.immovable = true

    var ledge = platforms.create(400, 400, 'ground')

    ledge.body.immovable = true

    ledge = platforms.create(-150, 250, 'ground')

    ledge.body.immovable = true

    // The player and its settings
    var player = game.add.sprite(32, game.world.height - 150, 'dude')
    this.player = player

    //  We need to enable physics on the player
    game.physics.arcade.enable(player)

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2
    player.body.gravity.y = 300
    player.body.collideWorldBounds = true

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true)
    player.animations.add('right', [5, 6, 7, 8], 10, true)

    this.cursors = game.input.keyboard.createCursorKeys()

    var stars = game.add.group()
    this.stars = stars

    stars.enableBody = true

    for (var i = 0; i < 12; i++) {
      var star = stars.create(i * 70, 0, 'star')
      star.body.gravity.y = 300
      star.body.bounce.y = 0.7 + Math.random() * 0.2
    }

    this.scoreText = game.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'})
  },

  update: function () {
    game.physics.arcade.collide(this.player, this.platforms)

    this.player.body.velocity.x = 0

    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -150
      this.player.animations.play('left')
    } else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = 150
      this.player.animations.play('right')
    } else {
      this.player.animations.stop()
      this.player.frame = 4
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.body.velocity.y = -350
    }

    game.physics.arcade.collide(this.stars, this.platforms)

    game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this)
  },

  collectStar: function (player, star) {
    star.kill()

    this.score += 10
    this.scoreText.text = 'Score: ' + this.score

    if (this.stars.xyzzy) {
      game.state.start('win')
    }
  }
}
