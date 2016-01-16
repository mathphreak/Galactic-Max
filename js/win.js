/*global GalacticMax, Phaser*/

GalacticMax.winState = function (environment) {
  return {
    create: function () {
      var game = GalacticMax.game

      game.sound.stopAll()

      game.world.setBounds(0, 0, game.camera.width, game.camera.height)

      GalacticMax.score.bonus += GalacticMax.score.distance
      GalacticMax.score.distance = 0

      var gasCanScoreLayer = game.add.group()
      this.gasCanScoreLayer = gasCanScoreLayer

      var screwdriverScoreLayer = game.add.group()
      this.screwdriverScoreLayer = screwdriverScoreLayer

      this.updateScoreIcons()

      this.titleLabel = game.add.text(20, 15,
        'Level Complete - Score: ' + GalacticMax.score.total(),
        {font: '20px League Spartan', fill: '#ffffff'})
      this.instructions = game.add.text(20, 220, 'Z to move\nX to select',
        {font: '20px League Spartan', fill: '#ffffff'})

      this.gasCanScoreLayer.x = 20
      this.gasCanScoreLayer.y = this.titleLabel.bottom

      this.screwdriverScoreLayer.x = game.canvas.width - 20
      this.screwdriverScoreLayer.y = this.titleLabel.bottom

      this.options = {}
      this.options.group = game.add.group()

      this.options.group.x = 20
      this.options.group.y = this.titleLabel.bottom + 24

      this.options.rapidfire = game.add.group(this.options.group, 'rapidfire')
      this.options.rapidfire.x = 0
      this.options.rapidfire.y = 0
      var rfIcon = this.options.rapidfire.create(0, 4, 'upgrades/rapidfire')
      rfIcon.scale.setTo(2, 2)
      this.options.rapidfire.classType = Phaser.Text
      var rfLabel = this.options.rapidfire.create(rfIcon.width + 5, 0, 'Rapid Fire',
        {font: '15px League Spartan', fill: '#fff'})

      this.options.trishot = game.add.group(this.options.group, 'trishot')
      this.options.trishot.x = 0
      this.options.trishot.y = rfLabel.height
      var sIcon = this.options.trishot.create(0, 4, 'upgrades/trishot')
      sIcon.scale.setTo(2, 2)
      this.options.trishot.classType = Phaser.Text
      this.options.trishot.create(sIcon.width + 5, 0, 'Trishot',
        {font: '15px League Spartan', fill: '#fff'})

      this.options.speed_control = game.add.group(this.options.group, 'speed_control')
      this.options.speed_control.x = 0
      this.options.speed_control.y = 2 * rfLabel.height
      var scIcon = this.options.speed_control.create(0, 4, 'upgrades/speedctl')
      scIcon.scale.setTo(2, 2)
      this.options.speed_control.classType = Phaser.Text
      this.options.speed_control.create(scIcon.width + 5, 0, 'Speed Control',
        {font: '15px League Spartan', fill: '#fff'})

      this.options.continue = game.add.group(this.options.group)
      this.options.continue.x = 0
      this.options.continue.y = 3 * rfLabel.height
      this.options.continue.classType = Phaser.Text
      this.options.continue.create(scIcon.width + 5, 0, 'Continue',
        {font: '15px League Spartan', fill: '#fff'})

      this.options.array = [
        this.options.rapidfire,
        this.options.trishot,
        this.options.speed_control,
        {isContinue: true}
      ]

      this.updateUpgrades()

      this.options.selection = {}

      this.options.selection.offset = this.options.group.y + 4
      this.options.selection.gap = rfLabel.height
      this.options.selection.selected = 3
      this.options.selection.y = function () {
        return this.offset + this.selected * this.gap
      }

      this.options.selection.arrow = game.add.sprite(2, this.options.selection.y(),
        'selector')
      this.options.selection.arrow.scale.setTo(2, 2)

      this.zKey = game.input.keyboard.addKey(Phaser.Keyboard.Z)
      this.xKey = game.input.keyboard.addKey(Phaser.Keyboard.X)
    },

    update: function () {
      if (!this.zKeyBlocked && this.zKey.isDown) {
        this.zKeyBlocked = true
        this.options.selection.selected--
        if (this.options.selection.selected < 0) {
          this.options.selection.selected = 3
        }
      } else if (!this.zKey.isDown) {
        this.zKeyBlocked = false
      }

      if (this.xKey.isDown) {
        var selected = this.options.array[this.options.selection.selected]
        if (selected.isContinue) {
          this.continue()
        } else {
          if (selected.alpha !== 0.5) {
            GalacticMax.upgrades[selected.name] = true
            GalacticMax.score.collectibles['screwdriver'] -= 5
            this.updateScoreIcons()
            this.updateUpgrades()
            this.game.sound.play('sfx/powerup')
          }
        }
      }

      this.options.selection.arrow.y = this.options.selection.offset +
        this.options.selection.selected * this.options.selection.gap
    },

    continue: function () {
      if (environment === 'space') {
        GalacticMax.game.state.start('play_venus')
      } else if (environment === 'venus') {
        GalacticMax.game.state.start('play_mothership')
      } else {
        GalacticMax.game.state.start('victory')
      }
    },

    updateScoreIcons: function () {
      this.gasCanScoreLayer.removeAll()
      this.screwdriverScoreLayer.removeAll()

      while (this.gasCanScoreLayer.total < GalacticMax.score.collectibles['gasCan']) {
        var xOffset = this.gasCanScoreLayer.total * 16
        var can = this.gasCanScoreLayer.create(xOffset, 0, 'gasCan')
        can.anchor.setTo(0, 0)
        can.scale.setTo(2, 2)
      }

      while (this.screwdriverScoreLayer.total < GalacticMax.score.collectibles['screwdriver']) {
        var xOffset2 = this.screwdriverScoreLayer.total * 16
        var screwdriver = this.screwdriverScoreLayer.create(-xOffset2, 0, 'screwdriver')
        screwdriver.anchor.setTo(1, 0)
        screwdriver.scale.setTo(2, 2)
      }
    },

    updateUpgrades: function () {
      for (var upgrade in GalacticMax.upgrades) {
        if (GalacticMax.upgrades[upgrade]) {
          this.options[upgrade].alpha = 0.5
          this.options[upgrade].forEach(function (el) {
            if (el instanceof Phaser.Text) {
              el.fill = '#8f8'
            }
          })
        } else if (GalacticMax.score.collectibles['screwdriver'] < 5) {
          this.options[upgrade].alpha = 0.5
          this.options[upgrade].forEach(function (el) {
            if (el instanceof Phaser.Text) {
              el.fill = '#f88'
            }
          })
        } else {
          this.options[upgrade].alpha = 1
        }
      }
    },

    render: GalacticMax.mirrorCanvases
  }
}
