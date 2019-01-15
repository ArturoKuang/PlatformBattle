class Player {
    constructor(game,x,y,sprite, controls,id){
        this.game = game;
        this.playerSpeed = 300;
        this.jumpTimer = 150;
        this.shootTime = 0;
        this.playerScore = 0;
        this.startX = x;
        this.startY = y;
        this.id = id;
        this.jump = false;
        //initialize player in phaser
        this.player = game.add.sprite(x, y, sprite);
        this.player.anchor.setTo(0.5, 0.5);
        //this.player.animations.add('idle',[],1,true);
        this.player.animations.add('idle',[0,1,2],2,true);
        this.player.animations.add('jump',[13,14],2,true);
        this.player.animations.add('run',[13,14,15,16,17,18,19,20],8,true);
        this.player.animations.add('land',[3,4,5,6,7],5,true);
        this.player.animations.add('attack',[3,4,5,6,7],4,true);
        this.player.animations.add('shoot',[39,40,41,42,43],5,false);
        this.player.animations.add('throw',[39,40,41,42,43],5,false);
        this.player.animations.add('hurt',[29,28,27,26],10,true);
        //score
        this.scoreTime = 0;
        game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;
        this.player.body.mass = 1.0;
        this.player.body.maxVelocity = 500;
        this.controls = controls;
        //intialize bullets 
        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(5, 'bullet');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 0.5);
        this.bullets.setAll('allowGravity', false);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.callAll('animations.add', 'animations', 'shoot', [0,1,2,3], 5, false);
        //this.bullets.animations.add('shoot',[0,1,2,3], 5, true);
        this.bullet = {};
        //intialize bomb 
        this.bombs = game.add.group();
        this.bombs.enableBody = true;
        this.bombs.physicsBodyType = Phaser.Physics.ARCADE;
        this.bombs.createMultiple(5, 'bomb');
        this.bombs.setAll('anchor.x', 0.5);
        this.bombs.setAll('anchor.y', 0.5);
        this.bombs.setAll('outOfBoundsKill', true);
        this.bombs.setAll('checkWorldBounds', true);
        this.bomb = {};
        //intialize wall 
        this.walls = game.add.group();
        this.walls.enableBody = true;
        this.walls.physicsBodyType = Phaser.Physics.ARCADE;
        this.walls.createMultiple(5, 'bullet');
        this.walls.setAll('anchor.x', 0.5);
        this.walls.setAll('anchor.y', 0.5);
        this.walls.setAll('scale.x', 0.5);
        this.walls.setAll('scale.y', 0.5);
        this.walls.setAll('allowGravity', false);
        this.walls.setAll('outOfBoundsKill', true);
        this.walls.setAll('checkWorldBounds', true);
        this.wall = {};
        //bomb particles
        this.emitter = this.game.add.emitter(0, 0, 550);
        this.emitter.makeParticles('bomb');
        this.emitter.gravity = 0;
        this.emitter.minParticleSpeed.setTo(-300, -300);
        this.emitter.maxParticleSpeed.setTo(300, 300);
        this.emitter.minRotation = 0;
        this.emitter.maxRotation = 0;
        this.emitter.allowGravity = false;
        //LOAD ALL SOUND
        shootSound = game.add.audio('shoot', 3);
        explodeSound = game.add.audio('explode');
        jumpSound = game.add.audio('jump');
        throwSound = game.add.audio('throw');
        hurtSound = game.add.audio('hurt');
        //LOAD TEXT TAG
        this.textTag = game.add.bitmapText(this.player.body.position.x + 30, this.player.body.position.y, 'carrier_command', "player"+this.id,12);
        this.textTag.anchor.setTo(0.5, 0.5);
    }

    shoot(){
        if(this.game.time.now > this.shootTime){
            this.bullet = this.bullets.getFirstExists(false);
            if(this.bullet){
                this.bullet.reset(this.player.x, this.player.y);
                this.bullet.scale.x = this.player.scale.x;
                this.player.animations.play('shoot');
                this.bullet.animations.play('shoot');
                shootSound.play();
                //this.fx.play('jump');
                this.bullet.body.allowGravity = false;
                this.bullet.lifespan = 500;
                this.bullet.body.velocity.x = 600 * this.player.scale.x;
                //this.bullet.body.velocity.y = -100;
                this.shootTime = this.game.time.now + 900;
                this.bulletLifeTime = 0;
            }
        }
    }

    throwBomb(platforms){
        if(this.game.time.now > this.shootTime){
            this.bomb = this.bombs.getFirstExists(false);
            if(this.bomb){
                this.player.animations.play('shoot');
                throwSound.play();
                this.bomb.reset(this.player.x, this.player.y);
                this.game.physics.arcade.collide(this.bomb, layer);
                this.game.physics.arcade.collide(this.bomb, platforms);
                this.bomb.lifespan = 800;
                this.bomb.body.collideWorldBounds = true;
                this.bomb.body.bounce.setTo(1,.5);
                this.bomb.body.velocity.x = 25 * this.player.scale.x;
                this.bomb.body.velocity.y = -850;
                this.shootTime = this.game.time.now + 900;
            }
        }
    }

    createWall(){
        if(this.game.time.now > this.shootTime){
            this.wall = this.walls.getFirstExists(false);
            if(this.wall){
                this.wall.reset(this.player.x + (200 * this.player.scale.x), this.player.y);
                this.wall.body.allowGravity = false;
                this.wall.lifespan = 5000;
                //this.wall.body.velocity.x = 600 * this.player.scale.x;
                //this.bullet.body.velocity.y = -100;
                this.shootTime = this.game.time.now + 900;
            }
        }
    }

    superJump(){
        this.player.animations.play('jump');
        jumpSound.play();
        this.player.body.velocity.y = -1000;
    }

    reset(){
        this.player.reset(this.startX, this.startY);
    }

    update(platforms, playerTwo){
        this.game.physics.arcade.collide(this.player, platforms);
        this.game.physics.arcade.collide(this.player, layer);
        
        this.textTag.position.x = this.player.body.position.x + 22;
        this.textTag.position.y = this.player.body.position.y - 10;

        if(this.controls.up.isDown || this.controls.up.isDown && this.controls.right.isDown
           || this.controls.up.isDown && this.controls.left.isDown){
            this.player.animations.play('jump');
        }
        if(this.controls.right.isDown){
            if(this.player.body.velocity.y == 0){
                this.player.animations.play('run');
            }
            this.player.scale.setTo(1,1);
            this.player.body.velocity.x += this.playerSpeed;
        }
        if(this.controls.left.isDown){
            if(this.player.body.velocity.y == 0){
                this.player.animations.play('run');
            }
            this.player.scale.setTo(-1,1);
            this.player.body.velocity.x -= this.playerSpeed;
        }

        if(this.controls.up.isDown && 
           (this.player.body.onFloor() || this.player.body.touching.down) &&
           this.game.time.now > this.jumpTimer){

            this.jump = true;
            jumpSound.play();
            this.player.body.velocity.y = -1000;
            this.jumpTimer = this.game.time.now + 750;
        }

        if(this.player.body.velocity.x == 0){
            if(this.player.body.velocity.y == 0 && this.jump){
                this.player.animations.play('land');
                this.jump = false;
            }
            else{
                this.player.animations.play('idle');
            }
        }


        if(checkOverlap(this.bullets, playerTwo)){
            //this.bullet.kill();
            hurtSound.play();
            playerTwo.animations.play('hurt');
            this.game.camera.shake(0.001, 100);
            playerTwo.body.velocity.x += this.bullet.body.velocity.x * 3;
        }
        
        //check bullet agianst layer
        this.game.physics.arcade.overlap(this.bullets,platforms, function(layer, bullet) {layer.kill();}, null, this);
        if(this.game.physics.arcade.collide(this.bullet, layer)){
            this.bullet.kill();  
        }

        this.game.physics.arcade.collide(this.bomb, layer);
        this.game.physics.arcade.collide(this.bomb, platforms);



        if(this.bomb.lifespan <= 0 && this.bomb){
            this.emitter.x = this.bomb.x;
            this.emitter.y = this.bomb.y;
            explodeSound.play();
            this.emitter.start(true, 100, null, 30);
            this.game.camera.shake(0.01, 100);
            var dist = distance(playerTwo.body.position.x,playerTwo.body.position.y, this.bomb.position.x,this.bomb.position.y);
            if(dist < 90){
                //console.dir(dist);
                //console.log("super explode");
                var force = (90 - dist) / playerTwo.body.mass;
                var angle = this.game.physics.arcade.angleBetween(this.bomb, playerTwo);
                if(angle == 0){
                    angle = 1;
                }
                playerTwo.animations.play('hurt');
                hurtSound.play();
                playerTwo.body.velocity.x += playerTwo.body.acceleration.x + Math.cos(angle) * force * 200;
                playerTwo.body.velocity.y += playerTwo.body.acceleration.y + Math.sin(angle) * force * 200;
            }
            this.bomb.lifespan = 800;
        }


    }
};

