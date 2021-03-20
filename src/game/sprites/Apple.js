import Phaser from 'phaser';
export default class Apple extends Phaser.GameObjects.Sprite{
    constructor(obj){
        super(obj.scene, obj.x, obj.y, obj.key);
        obj.scene.physics.world.enable(this);        
        this.body.collideWorldBounds = true;
        this.body.onWorldBounds = true;
        
        obj.scene.add.existing(this, false);
        this.accelaration=20;
        this.speed = obj.speed;
        this.direction = 37;
        this.animsuffix = '';
        // this.small();
        // this.body.setSize(this.width-20, this.height-60, true);
        this.setScale(0.2);
        this.alive = true;
        this.type = obj.type;
        
    }
    update(direction, time, delta){
    }
}