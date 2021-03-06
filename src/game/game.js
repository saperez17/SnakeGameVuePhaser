// import { create } from 'core-js/core/object';
import Phaser from 'phaser';
import GameScene from './scenes/gamescene';
// import InputText from 'phaser3-rex-plugins/plugins/inputtext.js';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin'


function launch(containerId){
    return new Phaser.Game({
        type: Phaser.AUTO,
        parent: containerId,
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
            height:460 
        },
        preload(){        
        },
        create(){
        }

    }
    );
}


export default launch;
export { launch }