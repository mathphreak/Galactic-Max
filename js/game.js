/*global Phaser, bootState, loadState, menuState, playState, winState*/

var game = new Phaser.Game(
  320,
  280,
  Phaser.CANVAS,
  '')

game.state.add('boot', bootState)
game.state.add('load', loadState)
game.state.add('menu', menuState)
game.state.add('play', playState)
game.state.add('win', winState)
game.state.add('lose', loseState)

game.state.start('boot')
