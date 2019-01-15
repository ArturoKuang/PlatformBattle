Game.GameOver = function(game){
    
};

var titlescreen;
Game.GameOver.prototype = {
    create:function(game){
        this.stage.backgroundColor = '#000000'; 
        var winner = 'PLAYER TWO WINS';
        if(victory == false){
            winner = 'PLAYER ONE WINS';
        }
        this.title = game.add.bitmapText(253, 324, 'carrier_command', winner,56);
        this.title.tint = 0xE5B9B9;
        this.button = createButton(game, "Play Agian", 'buttonLongGrey', game.world.centerX, game.world.centerY + 90, 300, 100,
        function(){
            this.state.start('MainMenu');
        });
        
        
    },
    
    update:function(game){
        if(this.button.input.pointerOver()){
            this.button.alpha= 1;
        }
        else{
            this.button.alpha= 0.9;
        }
    }, 
    
};