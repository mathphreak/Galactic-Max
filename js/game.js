/*global Phaser, TRCGame*/

TRCGame.game = new Phaser.Game(
  320,
  280,
  Phaser.CANVAS,
  '')

TRCGame.game.state.add('boot', TRCGame.bootState)
TRCGame.game.state.add('load', TRCGame.loadState)
TRCGame.game.state.add('menu', TRCGame.menuState)
TRCGame.game.state.add('play_space', TRCGame.playState('space'))
TRCGame.game.state.add('play_venus', TRCGame.playState('venus'))
TRCGame.game.state.add('play_mothership', TRCGame.playState('mothership'))
TRCGame.game.state.add('win_space', TRCGame.winState('space'))
TRCGame.game.state.add('win_venus', TRCGame.winState('venus'))
TRCGame.game.state.add('win_mothership', TRCGame.winState('mothership'))
TRCGame.game.state.add('lose', TRCGame.loseState)
TRCGame.game.state.add('victory', TRCGame.victoryState)

TRCGame.game.state.start('boot')
