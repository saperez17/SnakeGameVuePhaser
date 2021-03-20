<template>
  <div>
      <ion-phaser
              v-bind:game.prop='game'
              />
  </div>
</template>

<script>
import Phaser from "phaser";

import head from '../assets/sprites/tiles/tile019.png';
import body from '../assets/sprites/tiles/tile024.png';
import tail from '../assets/sprites/tiles/tile030.png';
import sky from '../assets/GameBackground.png'

class Player{
    constructor(player={}){
        this.position = {x: player.x, y:player.y};
        this.speed = player.speed;
        this.direction=player.direction;
        this.onMovement=player.onMovement;
    }

    doSomething(){

    }
}
// var obstacles;
var platforms;
// var my_player;
export default {
    name:"GameArea",
    data(){
        return {
    
      initialize: true,
      game: {
        width: 800,
        height: 550,
       
        type: Phaser.AUTO,
        scene: {
          init() {
            this.cameras.main.setBackgroundColor("#24252A");
           
          },
          preload(){       
            // let player = []
            // head = new this.square(20,20, 'black','', 20, 20, 2)
              this.load.image('background', sky);
              this.load.image('head', head);
              this.load.image('body', body);
              this.load.image('tail', tail);
            //   this.load.image('snake', require('../assets/sprites/tile021.png'));
              
            //   this.load.image('snakes', blueSrc);
              
            //   var data = new Image();
            //   data.src=dataURI;
              
            //   this.load('grid', require('../assets/sprites/snake-graphics.png'));

          },
          
          create() {
              this.add.image(0, 0, sky);
            //  this.physics.startSystem(Phaser.Physics.ARCADE);
             platforms = this.add.group();
             platforms.enableBody = true;

            //  my_player = this.add.image(0,0, 'head');
            //  this.physics.arcade.enable(my_player);

           let head = new Player({x:20, y:20, speed:0, direction:39, onMovement:false});
              this.keys = {
                    up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
                    left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
                    right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
                    down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
              };
              head.position = 10;
              
            let snake_head = this.add.sprite(200,200,'snake');
            this.physics.arcade.enable(snake_head);
              
            //   snake = this.add.image(20,20, 'head');
            //   this.physics.arcade.enable(snake);
            //   this.add.image(150,200,'snakes').setScale(0.2)
            
            //   player  = this.physics.add.sprite(50, 250, 'snake');
            //   player.setBounce(0,2);
            //   player.setCollideWorldBounds(true);
            // this.add.image(150,150, 'grid');
            // this.add.image(2,2, 'snake', '__BASE').setOrigin(10,10)
              
            //   player.setBounce(0.2);
            //   player.setCollideWorldBounds(true);
          },
          update() {
            // this.body.angle += 1;
          }
        }
      }
    };
    }
}
</script>

<style>

</style>