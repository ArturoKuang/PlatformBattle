Game.Level1 = function(game){};
var map;
var level;
var avgPos;
var platformTIme = 0;
var randomPlatformIndex = 0;
var platformTime = 0;
var button;
var drag;
var playerOne;
var playerTwo;
var playerOneCombo = [];
var playerTwoCombo = [];
var bg;
var bitmapText;
var platformSound;
var scoreWin = 1000;


Game.Level1.prototype = {
    //Intializes the game
    create: function(game){
        this.stage.backgroundColor = '#3A5963'; 
        //intialize background
        bg = new background(game);
        
        //intialize map  
        this.physics.arcade.gravity.y = 1400;
        map = this.add.tilemap('map', 70,70);
        map.addTilesetImage('tileset');

        layer = map.createLayer(0);
        layer.resizeWorld();
        map.setCollisionBetween(30,56,29);
        map.forEach(function(t){
            if(t.index == 56 || t.index == 29){
                t.collideDown = false;
            }
        }, game,0,0,map.width,map.height,layer);
        
        //LOAD AUDIO
        music = this.add.audio('song',.5,true);
        music.play();
        platformSound = game.add.audio('platform');
        platformSound.volume = .3;

        //intialize platforms 
        this.clouds = this.add.physicsGroup();
        var c1 = new cloudPlatform(this.game, 1104, 486, 'cloud',this.clouds);
        var c2 = new cloudPlatform(this.game, 356, 235, 'cloud',this.clouds);
        var c3 = new cloudPlatform(this.game, 1104, 235, 'cloud',this.clouds);
        var c4 = new cloudPlatform(this.game, 356, 486, 'cloud',this.clouds);
        var c5 = new cloudPlatform(this.game, 750, 335, 'cloud',this.clouds);

        //intialize players
        playerOne = new Player(game,395,827,'player', {
            right: this.input.keyboard.addKey(Phaser.Keyboard.D),
            left: this.input.keyboard.addKey(Phaser.Keyboard.A),
            up: this.input.keyboard.addKey(Phaser.Keyboard.W),
            ComboKey1 : this.input.keyboard.addKey(Phaser.Keyboard.R),
            ComboKey2 : this.input.keyboard.addKey(Phaser.Keyboard.T),
            ComboKey3 : this.input.keyboard.addKey(Phaser.Keyboard.Y)
        },1);


        playerTwo = new Player(game,1109,827,'player', {
            right: this.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
            left: this.input.keyboard.addKey(Phaser.Keyboard.LEFT),
            up: this.input.keyboard.addKey(Phaser.Keyboard.UP),
            ComboKey1 : this.input.keyboard.addKey(Phaser.Keyboard.I),
            ComboKey2 : this.input.keyboard.addKey(Phaser.Keyboard.O),
            ComboKey3 : this.input.keyboard.addKey(Phaser.Keyboard.P)
        },2);
        playerOne.player.scale.setTo(1,1);
        playerTwo.player.scale.setTo(-1,1);

        //intialize combos 
        //player one
        for(var key in combos){
            if(combos.hasOwnProperty(key)){
                playerOneCombo.push(new MultiKeyCombo(combos[key], playerOne, 1,game));
            }
        }

        //player two 
        for(var key in combos){
            if(combos.hasOwnProperty(key)){
                playerTwoCombo.push(new MultiKeyCombo(combos[key], playerTwo, 2,game));
            }
        }
        //add on blur 
        game.onBlur.add(function() {music.stop();}, this);
        //add on focus
        game.onFocus.add(function() {music.play();}, this);

        //intialize camera position  
        avgPos = this.add.sprite((playerOne.player.x + playerTwo.player.x) / 2, 
                                 (playerOne.player.y + playerTwo.player.y) / 2, null);


        //intialize score text
        bitmapText = game.add.bitmapText(388, 121, 'carrier_command', playerOne.playerScore + '        :        ' +  playerTwo.playerScore,34);
        bitmapText.inputEnabled = true;
        bitmapText.fixedToCamera = true;
        //enable camera follow 
        this.camera.follow(avgPos);


    },

    update:function(game){
        if(playerOne.playerScore >= scoreWin){
            music.stop();
            this.state.start('GameOver');
        }
        if(playerTwo.playerScore >= scoreWin){
            music.stop();
            victory = true;
            this.state.start('GameOver');
        }

        //reset velocity 
        playerOne.player.body.velocity.x = 0;
        playerTwo.player.body.velocity.x = 0;
        //reset acceleration
        playerOne.player.body.acceleration.x = 0;
        playerTwo.player.body.acceleration.x = 0;
        playerOne.player.body.acceleration.y = 0;
        playerTwo.player.body.acceleration.y = 0;

        playerOne.update(this.clouds, playerTwo.player);
        bg.update();
        bitmapText.setText(playerOne.playerScore + '        :        ' +  playerTwo.playerScore);
        //check combos for player one
        if(playerOneCombo[0].KeyPressed()){
            playerOne.shoot();
        }
        if(playerOneCombo[1].KeyPressed()){
            playerOne.superJump();
        }
        if(playerOneCombo[2].KeyPressed()){
            playerOne.throwBomb(this.clouds);
        }
        if(playerOneCombo[3].KeyPressed()){
            playerOne.createWall();
        }

        //check combos for player two 
        playerTwo.update(this.clouds, playerOne.player);
        if(playerTwoCombo[0].KeyPressed()){
            playerTwo.shoot();
        }
        if(playerTwoCombo[1].KeyPressed()){
            playerTwo.superJump();
        }
        if(playerTwoCombo[2].KeyPressed()){
            playerTwo.throwBomb(this.clouds);
        }
        if(playerTwoCombo[3].KeyPressed()){
            playerTwo.createWall();
        }

        this.randomPlatform();

        //check for player on platforms 
        this.clouds.hash.forEach(function(platform){
            if(platform.tint != 0xffffff){
                if(checkOverlap(playerOne.player, platform) && 
                   checkOverlap(playerTwo.player, platform)){
                    return;
                }
                if(checkOverlap(playerOne.player, platform) && playerOne.player.body.velocity.y == 0){
                    platformSound.play();
                    playerOne.playerScore++;
                }
                if(checkOverlap(playerTwo.player, platform) && playerTwo.player.body.velocity.y == 0){
                    platformSound.play();
                    playerTwo.playerScore++;
                }
            }
        });
        //camera follow
        avgPos.x = (playerOne.player.x + playerTwo.player.x) / 2; 
        avgPos.y = (playerTwo.player.y + playerTwo.player.y) / 2;
    },
    //Debug information
    render: function(game){
        //game.debug.spriteInfo(playerOne.player, 32, 32);
        //game.debug.spriteInfo(playerTwo.player, this.scale.width - 500, 32);
        //game.debug.cameraInfo(game.camera, 500, 32);
    },
    //Chooses random platforms for play to capture 
    randomPlatform: function(){
        for(var i = 0; i < this.clouds.hash.length; i++){
            this.clouds.hash[randomPlatformIndex].tint = 0xffffff;
        }
        if(this.time.now % 80 == 0){
            randomPlatformIndex = Math.floor(Math.random() * this.clouds.hash.length);
            //console.dir(randomPlatformIndex);
        }
        if(this.time.now > platformTime){    
            this.clouds.hash[randomPlatformIndex].tint = 0xff00ff;
            platformTime = this.time.now + 5;
        }
    },

};





