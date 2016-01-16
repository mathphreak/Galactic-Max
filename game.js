/*global Phaser*/

var game = new Phaser.Game(800,
  600,
  Phaser.AUTO,
  '',
  { preload: preload, create: create, update: update })

function preload () {
}

function create () {
  game.physics.startSystem(Phaser.Physics.ARCADE)

  game.add.sprite(0, 0, 'sky')

  platforms = game.add.group()

  platforms.enableBody = true

  var ground = platforms.create(0, game.world.height - 64, 'ground')

  ground.scale.setTo(2, 2)

  ground.body.immovable = true

  var ledge = platforms.create(400, 400, 'ground')

  ledge.body.immovable = true

  ledge = platforms.create(-150, 250, 'ground')

  ledge.body.immovable = true
}

function update () {
}
