class MultiKeyCombo{
    constructor(buttons, player, playerID, game){
        this.player = player;
        this.playerID = playerID;
        this.game = game;
        this.buttons = buttons;
        this.currentIndex = 0;
        this.timeBetweenButtons = 300;
        this.timeLastButtonPressed = 0;
        this.keydown = [];
    }

    Check(){
        //checks for time in between combos
        if(this.game.time.now > this.timeLastButtonPressed + this.timeBetweenButtons){
            this.currentIndex = 0;
            //console.log("current index: " + this.currentIndex);

        }
        //checks if combo matches input
        if(this.currentIndex < this.buttons.length){
            //checks keys
            if(this.buttons[this.currentIndex] == "ComboKey1" && this.keydown[this.player.controls.ComboKey1.keyCode]||
               this.buttons[this.currentIndex] == "ComboKey2" && this.keydown[this.player.controls.ComboKey2.keyCode]||
               this.buttons[this.currentIndex] == "ComboKey3" && this.keydown[this.player.controls.ComboKey3.keyCode]){
                //console.dir(this.keydown);
                //console.log("combo");
                this.timeLastButtonPressed = this.game.time.now;
                this.currentIndex++;
            }
            //combo mathces key sequence 
            if(this.currentIndex >= this.buttons.length){
                this.currentIndex = 0;
                return true;
            }
            else return false;
        }
    }


    KeyPressed(){
        //keydown 
        if(this.player.controls.ComboKey1.isDown){
            if(!this.keydown[this.player.controls.ComboKey1.keyCode]){
                this.keydown[this.player.controls.ComboKey1.keyCode] = true;   
                if(this.Check() == true)
                    return true;
            }
        }

        if(this.player.controls.ComboKey2.isDown){
            if(!this.keydown[this.player.controls.ComboKey2.keyCode]){
                this.keydown[this.player.controls.ComboKey2.keyCode] = true;   
                if(this.Check() == true)
                    return true;
            }
        }

        if(this.player.controls.ComboKey3.isDown){
            if(!this.keydown[this.player.controls.ComboKey3.keyCode]){
                this.keydown[this.player.controls.ComboKey3.keyCode] = true;   
                if(this.Check() == true)
                    return true;
            }
        }
        
        //keyup
        if(this.player.controls.ComboKey1.isUp){
            this.keydown[this.player.controls.ComboKey1.keyCode] = false;
        }

        if(this.player.controls.ComboKey2.isUp){
            this.keydown[this.player.controls.ComboKey2.keyCode] = false;
        }

        if(this.player.controls.ComboKey3.isUp){
            this.keydown[this.player.controls.ComboKey3.keyCode] = false;
        }
    }
};