import Phaser from 'phaser'
export default class Snake extends Phaser.GameObjects.Sprite{
    constructor(obj){
        super(obj.scene, obj.x, obj.y, obj.key);
        obj.scene.physics.world.enable(this);
        // obj.scene.physics.setBoundsToWorld();
        
        this.body.collideWorldBounds = true;
        this.body.onWorldBounds = true;
        
        obj.scene.add.existing(this, false);
        this.accelaration=20;
        this.speed = obj.speed;
        this.direction = 37;
        this.animsuffix = '';
        this.small();
        this.body.setSize(this.width-20, this.height-60, true);
        // this.body.setGravityY(50);
        this.body.x = obj.x;
        this.body.y = obj.y;
        this.alive = true;
        this.type = 'snake';
        this.status=true;
        this.allowGravity=false;
        
    }
    update(status){
        this.status=status;
    }
    small(){
        this.setScale(0.2);
        // this.body.setSize(5, 5);
        // this.body.offset.set(3, 14);
    }

    resize(large){
        this.scene.physics.world.pause()
        if(large){
            this.scene.physics.world.resume();
        }
    }

    moveTo(x, y, direction, status){
        if(status){
            if(direction==38 || direction==40){
                this.angle = 90;
            }else{
                this.angle = 0;
            }
            this.x = x;
            this.y = y;            
        }else{
            this.x=100;
        }
    }
    nextPos(direction, status){
        if(status){
            switch(direction){
                case 37: //left
                this.x -= this.speed;
                this.angle = -180;
                break;
          
                case 38: //up
                this.y -= this.speed-8;
                this.angle = -90;
                break;
                
                case 39: //right
                this.x += this.speed;
                this.angle = 0;
                break;
          
                case 40: //down
                this.y += this.speed-8;
                this.angle = 90;
                break;
                default: return
              }
        }else{
            this.x=140;
        }
        
    }
    hitWorldBounds(){
        console.log("Hit World Bounds");
    }

}