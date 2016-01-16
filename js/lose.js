/*global GalacticMax, Phaser*/

GalacticMax.loseState = {
  create: function () {
    var game = GalacticMax.game

    game.sound.stopAll()

    game.world.setBounds(0, 0, game.camera.width, game.camera.height)

    var highScore = window.localStorage.getItem('GalacticMaxHighScore')
    highScore = highScore || -1

    this.nameLabel = game.add.text(20, 20, 'You lose!',
      {font: '30px League Spartan', fill: '#ffffff'})
    this.thisLabel = game.add.text(20, 90,
      'Your score: ' + GalacticMax.score.total(),
      {font: '20px League Spartan', fill: '#ffffff'})
    this.highLabel = game.add.text(20, 150,
      'High score: ' + highScore,
      {font: '20px League Spartan', fill: '#ffffff'})
    this.winLabel = game.add.text(20, 200, 'Press Z to restart',
      {font: '30px League Spartan', fill: '#ffffff'})

    if (GalacticMax.score.total() > highScore) {
      window.localStorage.setItem('GalacticMaxHighScore', GalacticMax.score.total())
    }

    var zKey = game.input.keyboard.addKey(Phaser.Keyboard.Z)

    zKey.onDown.addOnce(this.restart, this)
  },

  restart: function () {
    GalacticMax.game.state.start('play_space')
  },

  render: GalacticMax.mirrorCanvases
}
