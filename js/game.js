/*global Phaser, TRCGame*/

TRCGame.game = new Phaser.Game(
  320,
  280,
  Phaser.CANVAS,
  '')

TRCGame.game.state.add('boot', TRCGame.bootState)
TRCGame.game.state.add('load', TRCGame.loadState)
TRCGame.game.state.add('menu', TRCGame.menuState)
TRCGame.game.state.add('play', TRCGame.playState('space'))
TRCGame.game.state.add('play_venus', TRCGame.playState('venus'))
TRCGame.game.state.add('win', TRCGame.winState)
TRCGame.game.state.add('lose', TRCGame.loseState)

TRCGame.game.state.start('boot')
