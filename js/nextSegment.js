/*global GalacticMax*/

GalacticMax.generateNextSegment = function (environment) {
  return function () {
    // Save the current game object
    var game = this.game

    // KEep track of the starting X position
    var startX = this.nextStartX

    // Reset the boundaries of the world
    game.world.setBounds(game.camera.x, 0, startX + 500, game.world.height)

    // With a 25% chance, generate a crashed satellite
    if (game.rnd.frac() < 0.05 &&
      (!this.lastHarmlessPlatform() || this.lastHarmlessPlatform().x < startX - 100)) {
      // Create the satellite at (startX, game.world.height - 64)
      // with the image called 'crashedSat'
      var crashedSat = this.dangerPlatforms.create(startX,
        game.world.height - 64, 'crashedSat')

      // Add an animation called 'burn' using frames 0, 1, and 2
      // for 10 frames each that does loop
      crashedSat.animations.add('burn', [0, 1, 2], 10, true)

      // Play that animation
      crashedSat.animations.play('burn')

      // Scale up to 2x as big
      crashedSat.scale.setTo(2, 2)

      // Mark as immovable
      crashedSat.body.immovable = true
    } else if (game.rnd.frac() < 0.4) {
      // For a harmless platform, use this.harmlessPlatforms.create
      var normalSat = this.harmlessPlatforms.create(startX,
        game.world.height - 100, 'satellite')
      normalSat.scale.setTo(2, 2)
      normalSat.body.immovable = true
      // Otherwise, with a 25% chance, generate an alien
    }

    if (game.rnd.frac() < 0.2 &&
      (!this.lastDangerPlatform() || this.lastDangerPlatform().x < startX - 100)) {
      // Create the alien at (startX, 200)
      // with the image called 'alien'
      var alienArray = [130]
      if (!this.lastHarmlessPlatform() || this.lastHarmlessPlatform().x < startX - 100) {
        alienArray.push(200)
      }
      var alien = this.aliens.create(startX, game.rnd.pick(alienArray), 'alien')

      // Add an animation called 'die' using frames 0, 1, and 2
      // at 10 fps that does not loop
      var alienDeath = alien.animations.add('die', [0, 1, 2], 10, false)

      // Tell this animation that it should kill the alien when it is done
      alienDeath.killOnComplete = true

      // Scale up to 2x as big
      alien.scale.setTo(2, 2)

      // Don't bounce at all when landing on thr ground
      alien.body.bounce.y = 0

      // Follow gravity
      alien.body.gravity.y = 300
    } else if (game.rnd.frac() < 0.1) {
      var spaceshipPos = game.rnd.integerInRange(0, 130)
      var spaceship = this.spaceships.create(startX, spaceshipPos, 'spaceship')

      game.physics.arcade.enable(spaceship)

      var spaceshipDeath = spaceship.animations.add('die', [0, 1, 2, 3, 4],
        10, false)

      spaceshipDeath.killOnComplete = true

      spaceship.scale.setTo(2, 2)

      spaceship.body.bounce.y = 1

      spaceship.body.gravity.y = 300
    }

    // Place platforms along thr ground
    for (var i = startX; i < startX + 480; i += 48) {
      // Create a platform at (i, game.world.height - 32)
      // with the image called 'platform_' + environment
      // (this will be 'platform_space', etc.)
      var ground = this.platforms.create(i, game.world.height - 32, 'platform_' + environment)

      // Scale up to 2x as big
      ground.scale.setTo(2, 2)

      // Mark as immovable
      ground.body.immovable = true
    }

    // 1/4 of the time, generate a gas can
    if (game.rnd.frac() < 0.15) {
      var gasCan = this.gasCans.create(startX + 200, game.world.height - 120, 'gasCan')
      gasCan.scale.setTo(2, 2)
      // Otherwise, 1/10 of the time, generate a screwdriver
    } else if (game.rnd.frac() < 0.1) {
      var screwdriver = this.screwdrivers.create(startX + 200, game.world.height - 64, 'screwdriver')
      screwdriver.scale.setTo(2, 2)
    }

    // If we've found at least five gas cans...
    if (GalacticMax.score.collectibles['gasCan'] >= 5) {
      // 20% of the time...
      if (game.rnd.frac() < 0.05) {
        // Create a rocket
        var rocket = this.rockets.create(startX + 350, game.world.height - 32, 'rocket')

        // Create an animation called 'idle' that only uses frame 0
        // for 10 frames and does not loop
        rocket.animations.add('idle', [0], 10, false)

        // Create a second animation called 'explode' that uses frames
        // 1, 2, 3 for 10 frames each and does not loop
        rocket.animations.add('explode', [1, 2, 3], 10, false)

        // Start by playing the idle animation
        rocket.animations.play('idle')

        // Scale up
        rocket.scale.setTo(2, 2)

        // The coordinates used to create the rocket should be lined up with
        // the middle of the bottom edge of the image itself
        rocket.anchor.setTo(0.5, 1)
      }
    }

    // Make the next startX be 480 away (since we generated 480 pixels of
    // platforms). This is not magic; it can be a different number if that
    // makes sense.
    this.nextStartX = startX + 50
  }
}
