/*global TRCGame*/

TRCGame.generateNextSegment = function () {
  var game = this.game
  var startX = this.latestPlatform().right
  game.world.setBounds(game.camera.x, 0, startX + 500, game.world.height)
  if (game.rnd.frac() < 0.25) {
    var crashedSat = this.platforms.create(startX,
      game.world.height - 64, 'crashedSat')
    crashedSat.animations.add('burn', [0, 1, 2], 10, true)
    crashedSat.animations.play('burn')
    crashedSat.scale.setTo(2, 2)
    crashedSat.body.immovable = true
  } else if (game.rnd.frac() < 0.25) {
    var alien = this.aliens.create(startX, 200, 'alien')
    alien.scale.setTo(2, 2)
    alien.body.bounce.y = 0
    alien.body.gravity.y = 300
    alien.body.collideWorldBounds = true
  }
  for (var i = startX; i < startX + 500; i += 48) {
    var ground = this.platforms.create(i, game.world.height - 32, 'platform')
    ground.scale.setTo(2, 2)
    ground.body.immovable = true
  }
  if (game.rnd.frac() < 0.25) {
    var gasCan = this.gasCans.create(startX + 200, game.world.height - 64, 'gasCan')
    gasCan.scale.setTo(2, 2)
  } else if (game.rnd.frac() < 0.1) {
    var screwdriver = this.screwdrivers.create(startX + 200, game.world.height - 64, 'screwdriver')
    screwdriver.scale.setTo(2, 2)
  }

  if (TRCGame.score.collectibles['gasCan'] >= 5) {
    if (game.rnd.frac() < 0.2) {
      var rocket = this.rockets.create(startX + 350, game.world.height - 32, 'rocket')
      rocket.animations.add('idle', [0], 10, false)
      rocket.animations.add('explode', [1, 2, 3], 10, false)
      rocket.animations.play('idle')
      rocket.scale.setTo(2, 2)
      rocket.anchor.setTo(0.5, 1)
    }
  }
}
