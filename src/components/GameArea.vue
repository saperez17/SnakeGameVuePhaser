<template>
<div>
  <div :id="containerId">
    </div>
</div>
  
  
</template>

<script>
import Phaser from 'phaser';
import GameScene from '../game/scenes/gamescene';
// import InputText from 'phaser3-rex-plugins/plugins/inputtext.js';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin'

export default {
    name:"GameArea",
    data: ()=>({
      emmiter:null,
      gameInstance:null,
      containerId: 'game-container',
    }),
    created: function(){
      this.gameInstance = new Phaser.Game({
        type: Phaser.AUTO,
        parent: this.containerId,
        dom: {
            createContainer:true,
        },
        plugins: {
            scene:[
                {key: 'GameScene',
				plugin: RexUIPlugin,
				mapping: 'rexUI'}
            ]
        },
        scene: [GameScene],
      
        physics: {
            default: 'arcade',
            arcade: {
                x:0,
                y:0,
                debug: false,
                gravity: { y: 0 },
                checkCollision:{
                    up:true,
                    down:true,
                    left:true,
                    right:true,
                }
            }
        },
        scale: {
            mode: Phaser.Scale.CENTER_BOTH,
            width:640,
            height:475 
        },
        preload(){        
        },
        create(){
        }

      });
      
      
    },
    mounted: function(){
    },
    methods: {
    }
}
</script>

<style scoped>

</style>