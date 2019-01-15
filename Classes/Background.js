//Creates parallax background 
class background{
    constructor(game){
        this.farBuildings = game.add.tileSprite(0,
                                                0,
                                                game.width,
                                                game.height,
                                                'far-buildings'
                                               );
        this.farBuildings.fixedToCamera = true;
        this.farBuildings.tileScale.set(4);
        
        this.building = game.add.tileSprite(0,
                                            0,
                                            game.width,
                                            game.height,
                                            'building'
                                           );
        
        this.building.fixedToCamera = true;
        this.building.tileScale.set(4);
        

        this.forground = game.add.tileSprite(0,
                                             0,
                                             game.width,
                                             game.height,
                                             'foreground'
                                            );
        this.forground.fixedToCamera = true;
        this.forground.tileScale.set(5);


    }
    //moves the images in parallax 
    update(){
        this.farBuildings.tilePosition.x -= 0.01;
        this.building.tilePosition.x -= 0.05;
        this.forground.tilePosition.x -= 0.06;
    }
};