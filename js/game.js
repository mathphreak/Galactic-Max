/*global Phaser, GalacticMax*/

GalacticMax.game = new Phaser.Game(
  320,
  280,
  Phaser.CANVAS,
  '')

GalacticMax.game.state.add('boot', GalacticMax.bootState)
GalacticMax.game.state.add('load', GalacticMax.loadState)
GalacticMax.game.state.add('menu', GalacticMax.menuState)
GalacticMax.game.state.add('play_space', GalacticMax.playState('space'))
GalacticMax.game.state.add('play_venus', GalacticMax.playState('venus'))
GalacticMax.game.state.add('play_mothership', GalacticMax.playState('mothership'))
GalacticMax.game.state.add('win_space', GalacticMax.winState('space'))
GalacticMax.game.state.add('win_venus', GalacticMax.winState('venus'))
GalacticMax.game.state.add('win_mothership', GalacticMax.winState('mothership'))
GalacticMax.game.state.add('lose', GalacticMax.loseState)
GalacticMax.game.state.add('victory', GalacticMax.victoryState)

GalacticMax.game.state.start('boot')
