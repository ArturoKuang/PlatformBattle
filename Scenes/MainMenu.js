Game.MainMenu = function(game){
    
};

var titlescreen;
Game.MainMenu.prototype = {
    create:function(game){
        titleSong = this.add.audio('titlesong',.8,true);
        titleSong.play();
        titlescreen = new background(game);
        this.title = game.add.bitmapText(253, 324, 'carrier_command', 'PLATFORM BATTLE',56);
        this.title.tint = 0xE5B9B9;
        this.button = createButton(game, "Play", 'buttonLongGrey', game.world.centerX, game.world.centerY + 90, 300, 100,
        function(){
            this.state.start('Level1');
            titleSong.stop();
        });
        game.onBlur.add(function() {titleSong.stop();}, this);
        //add on focus
        game.onFocus.add(function() {titleSong.play();}, this);
        
        
    },
    
    update:function(game){
        titlescreen.update();
        //button highlight 
        if(this.button.input.pointerOver()){
            this.button.alpha= 1;
        }
        else{
            this.button.alpha= 0.9;
        }
    }, 
    
};