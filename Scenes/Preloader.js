var combos;
var throwSound;
var shootSound;
var jumpSound;
var explodeSound;
var hurtSound;
var music;
var victory = false;
var titleSong;

Game.Preloader = function(game){

    this.preloadBar = null;

};

Game.Preloader.prototype = {
    preload: function(){
        //LOAD BUTTONS
        this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY,'preloaderBar');

        this.preloadBar.anchor.setTo(0.5, 0.5);
        this.time.advancedTiming = true;
        this.load.setPreloadSprite(this.preloadBar);
        
        this.load.image('buttonLongGrey', 'Assests/buttonLong_grey.png');

        //LOAD ALL FONTS
        this.load.bitmapFont('carrier_command', 'Assests/fonts/carrier_command.png', 'Assests/fonts/carrier_command.xml');
        //LOAD ALL ASSESTS
        this.load.tilemap('map', 'Assests/test.csv');
        this.load.image('tileset','Assests/platform.png');
        //LOAD PARALLAX BACKGROUND
        this.load.image('building', 'Assests/background/back-buildings.png');
        this.load.image('far-buildings', 'Assests/background/far-buildings.png');
        this.load.image('foreground', 'Assests/background/foreground.png');
        //load player
        this.load.spritesheet('player', 'Assests/spritesheet.png',37,37);
        this.load.spritesheet('buttons', 'Assests/button.png', 193, 71);
        this.load.spritesheet('bullet', 'Assests/shoot.png',28,20);
        this.load.spritesheet('bomb', 'Assests/bomb.png',17,17);
        this.load.image('cloud', 'Assests/battle_platforms.png');
        this.load.image('titlescreen', 'Assests/titlescreen.png');
        //LOAD ALL SOUND
        /* this.load.audio('sfx', ['Assests/sound/explode.wav', 'Assests/sound/jump.wav', 'Assests/sound/throw.wav']);*/
        this.load.audio('shoot', 'Assests/sound/shoot.wav');
        this.load.audio('explode', 'Assests/sound/explode.wav');
        this.load.audio('jump', 'Assests/sound/jump.wav');
        this.load.audio('throw', 'Assests/sound/throw.wav');
        this.load.audio('platform', 'Assests/sound/platform.wav');
        this.load.audio('hurt', 'Assests/sound/hurt.wav');
        this.load.audio('song', 'Assests/sound/ThemeSong.mp3');
        this.load.audio('titlesong', 'Assests/sound/titlesong.mp3');

        //get combo json
        var xhr = new XMLHttpRequest();
        xhr.onload = function(){
            combos = JSON.parse(xhr.responseText);
            //console.dir(combos);
        }
        var url = "Spells/Combos.json";
        xhr.open('GET', url);
        xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2010 00:00:00 GMT");
        xhr.send(); //send request
    },

    create:function(){
        this.state.start('MainMenu');
    }
};

//utility functions 
function checkOverlap(spriteA, spriteB){
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);
};

function distance (x1, y1, x2, y2) {

    var dx = x1 - x2;
    var dy = y1 - y2;

    return Math.sqrt(dx * dx + dy * dy);

};

function createButton (game,string,sprite,x,y,w,h,callback){
    var button1 = game.add.button(x,y,sprite,callback,game,2,1,0);

    button1.anchor.setTo(0.5, 0.5);
    button1.width = w;
    button1.height = h;
    button1.tint = 0x292121;

    var txt = game.add.bitmapText(button1.x, button1.y, 'carrier_command', string, 20);
    txt.tint = 0xE5B9B9;
    
    txt.anchor.setTo(0.5, 0.5);
    
    return button1;
};  
