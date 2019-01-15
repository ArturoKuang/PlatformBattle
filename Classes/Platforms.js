
//Makes a platform for player to capture 
var cloudPlatform = function(game, x, y, key, group){
    if(typeof group === 'undefined'){
        group = game.world;
    }
    Phaser.Sprite.call(this, game, x, y, key);
    game.physics.arcade.enable(this);
    this.anchor.x = 0.5;
    this.body.allowGravity = false;
    this.body.immovable = true;
    this.body.checkCollision.down = false;
    
    this.playerLocked = false;
    group.add(this);
};


cloudPlatform.prototype = Object.create(Phaser.Sprite.prototype);
cloudPlatform.prototype.constructor = cloudPlatform;