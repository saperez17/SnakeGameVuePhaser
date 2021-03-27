import Phaser from 'phaser';
import Snake from '../sprites/Snake';
import Apple from '../sprites/Apple';

import sky from '../../assets/GameBackground1.jpg';
import head from '../../assets/sprites/icons8-square-200.png';
import body from '../../assets/sprites/icons8-square-200.png';
import body_blend from '../../assets/sprites/icons8-square-200.png';
import green_apple from '../../assets/sprites/green_apple.png';
import red_apple from '../../assets/sprites/red_apple_a.png';
import restart_btn from '../../assets/sprites/buttons/restart_btn.png';
import start_btn from '../../assets/sprites/buttons/start_btn.png';
import restart_btn_hover from '../../assets/sprites/buttons/tile006.png';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin'
import spike from '../../assets/sprites/spikeA.png';
import EventDispatcher from '../../util/eventDispatcher';


var rect;
var pineapples;
var gameStatus = false;
var deltaTime = 0;
var sceneStatus = true;
var score = 0;
var gameOverTxt = '';
var restartBtnTxt;
// var player = []
var scene;
var btn_restart;
var btn_start;
var username = '';
var usernameText;
var overlapCollider;
var overlapTriggered = false;
var modifyBody = false;
var gameOverStatus = false;
const io = require("socket.io-client");
export default class GameScene extends Phaser.Scene{
    constructor(){
        super({
            key: 'GameScene'
        });
        this.resources = 0;
        this.timer = 0;
        this.direction = 0
        this.currentDirection = 0;
        // this.player = [];
        this.txt;
        this.allowedMovements =[37,38,39,40];
        this.appleGeneratorSeed = [];
        this.text;
        this.apples;
        this.player;
        this.obstacles;
        this.applesCount=0;
        this.scoreNum = score;  
        this.usernameScene = username;   
        this.event;
        this.socket;
    }

    preload(){
        this.load.image('spike', spike);
        this.load.image('sky', sky);
        this.load.image('head', head);
        this.load.image('body', body);
        this.load.image('red_apple', red_apple);
        this.load.image('green_apple', green_apple);
        this.load.image('body_blend', body_blend);
        this.load.image('restart_btn', restart_btn);
        this.load.image('restart_btn_hover', restart_btn_hover);
        this.load.image('start_btn', start_btn);
    }
    create(){
        this.emmiter = EventDispatcher.getInstance();
        scene = this;
        
        // this.cameras.main.setBounds(0, 0, 4000, 4000);

        this.add.image(320,220, 'sky').setScale(0.5);
        // this.input.on('drag', (point, gameObject, dragX, dragY)=>{
        //     gameObject.x = dragX;
        //     gameObject.y = dragY;
        // })
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.keys = {
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    };
    for (var i=0;i<10;i++){
        if(i<9){
            this.appleGeneratorSeed.push('green_apple')
        }else{
            this.appleGeneratorSeed.push('red_apple')
        }
    }
    this.physics.world.setBounds(0,0,this.sys.game.canvas.width,this.sys.game.canvas.height);
    this.physics.world.setBoundsCollision(true, true, true, true);
    
    this.input.keyboard.on('keydown', (event)=>{
        this.direction = parseInt(event.keyCode);
        if (!gameOverStatus){
            sceneStatus = true
            this.score.visible = true;
            this.apples.getChildren()[0].visible = true;
        }
        if(this.allowedMovements.includes(this.direction)){
            this.apples.getChildren()[0].visible = true;
            if(this.currentDirection==0){
                this.currentDirection = this.direction;
            }else{
                if ((this.currentDirection==37 || this.currentDirection==39) && (this.direction==38 || this.direction==40)){
                    this.currentDirection = this.direction;
                }else if((this.currentDirection==38 || this.currentDirection==40) && (this.direction==37 || this.direction==39)){
                    this.currentDirection = this.direction;
                }else{
                    console.log('Movement not allowed');
                }
            }
        }
        
    })
    const style = { font: "bold 32px Arial", fill: "#fff" };
    this.score = this.add.text(480, 0, `Score: ${score} `, style);
    this.score.visible=false;
    gameOverTxt = this.add.text(225, 110, `Game Over`, style);
    gameOverTxt.visible = false;
    usernameText = this.add.text(310, 195, 'Player Name', { fixedWidth: 140, fixedHeight: 20, color: '#000000', backgroundColor: 'white', align:'center' })
	usernameText.setOrigin(0.5, 0.5)
	usernameText.setInteractive().on('pointerdown', () => {
		this.rexUI.edit(usernameText);
	})
    btn_restart = scene.physics.add.image(310,165, 'restart_btn');
    btn_restart.setScale(0.2)
    btn_restart.setInteractive()
    btn_restart.visible = false;
    btn_start = scene.physics.add.image(310,220, 'start_btn');
    btn_start.setScale(0.3)
    btn_start.setInteractive()
    // this.score.visible=true;
        this.player = this.physics.add.group();
        this.player.add(new Snake({
            scene: this,
            key:'head',
            x:55,
            y:15,
            speed:41
        }));
        

        this.apples = this.physics.add.group();
        this.apples.add(new Apple({
            scene: this,
            key:'green_apple',
            x:Phaser.Math.Between(50,610),
            y:Phaser.Math.Between(30,430),
            speed:0
        }))
        
        this.obstacles = this.physics.add.group();
    btn_start.on('pointerdown', ()=>{
        username = usernameText.text;
        this.usernameScene = username;
        btn_start.visible = false;
        usernameText.destroy()
        
        this.physics.add.overlap(this.player, this.apples, overlapOn.bind(this));
        this.physics.add.overlap(this.player.getChildren()[0], this.obstacles, overlapOnObstacle.bind(this))
    })
    restartBtnTxt = scene.add.text(290, 155, `restart`, {font: 'bold 14px Arial',fill: "#fff"});
    restartBtnTxt.visible = false;
    btn_restart.on('pointerdown', ()=>{
        btn_restart.visible=false;
        gameOverTxt.visible=false;
        restartBtnTxt.visible=false;
        score=0;
        gameOverStatus = false;
        overlapTriggered = false;
        restartGame(scene);
        
    })
   

    this.physics.world.on('worldbounds', function(body, blockedUp, blockedDown, blockedLeft, blockedRight){
        // console.log('collision')
        btn_restart.visible = true;
        restartBtnTxt.visible = true;
        gameOverTxt.visible = true;
        restartBtnTxt.visible=true;
        saveUserScore();
        gameOver(scene);   
        if(sceneStatus){
            // console.log('collider')
            // restartGame(scene);
            sceneStatus=false;
        } 
      this.direction=0;
    })
    this.event =  new Event('registerScore');
    this.apples.getChildren()[0].visible = false;
}
    update(time, delta){
        this.timer += delta;
        if (this.timer >= 200 && sceneStatus==true){
            // console.log(sceneStatus)
            // console.log('X: ' + this.player.getChildren()[0].x + '\nY:' + this.player.getChildren()[0].y)
            
            this.resources += 1;
            this.timer = 0;
            if(modifyBody){
                let newBody = new Snake({
                    scene: this,
                    key:'body',
                    x:0,
                    y:0,
                    speed:0
                });
                newBody.visible=false;
                this.player.add(newBody)
                modifyBody = false;
            }
            if(this.allowedMovements.includes(this.direction)){
                for (var i=this.player.getTotalUsed()-1; i>=0; i--){
                    if (i!=0){
                        var posX = this.player.getChildren()[i-1].x
                        var posY  = this.player.getChildren()[i-1].y
                        var speed = this.player.getChildren()[i-1].speed
                        this.player.getChildren()[i].speed = speed;
                        this.player.getChildren()[i].moveTo(posX, posY, this.currentDirection, sceneStatus);
                    }else{
                        var runIntoWall = this.player.getChildren()[i].nextPos(this.currentDirection, sceneStatus);
                        if(runIntoWall){
                            sceneStatus=false;
                            gameOver(this);
                        }
                        // this.player.getChildren()[i].visible=true;
                    }
                }
                if(this.player.countActive()>4){
                    this.player.children.each((val, i)=>{
                        if(i>=4){
                            if(this.player.getChildren()[0].x==val.x && this.player.getChildren()[0].y==val.y){
                                console.log("snake bit itself");
                                sceneStatus=false;
                                gameOver(this);
                            }
                        }
                    })
                }
            }
            this.score.setText(
                `Score: ${score}`
              );
            // this.player.getChildren()[this.player.getTotalUsed()-1].visible=true;
        }
        if(this.player.countActive()>1){
            this.player.getChildren()[this.player.getTotalUsed()-1].visible=true;
        }
    }
}
function overlapOnObstacle(scene){
  if(!overlapTriggered){
      overlapTriggered = true;
      gameOver(this)
      console.log('obstacle collision');
  }
}
function overlapOn() {
    this.applesCount += 1;
    console.log('collision');
    if (this.applesCount % 2 == 0) {
        if (this.applesCount == 2) {
            this.obstacles.add(new Apple({
                scene: this,
                key: 'spike',
                x: Phaser.Math.Between(50, 610),
                y: Phaser.Math.Between(30, 430),
                speed: 0
            }))
        } else {
            this.obstacles.getChildren()[0].x = Phaser.Math.Between(50, 580)
            this.obstacles.getChildren()[0].y = Phaser.Math.Between(50, 400)
        }
    }
    
    this.apples.getChildren()[0].x = 30;
    if (this.apples.getChildren()[0].texture.key == 'green_apple') {
        score += 1;
        this.scoreNum = score;
        modifyBody = true;
    } else if (this.apples.getChildren()[0].texture.key == 'red_apple') {
        score -= 1;
        this.scoreNum = score;
        if (this.player.getTotalUsed() >= 1) {
            this.player.getChildren()[this.player.getTotalUsed() - 1].destroy()
            // this.player.pop();
        } else {
            this.text = this.add.text(240, 250, `Game Over `);
        }
    }
    this.apples.clear(true, true);
    this.apples.add(new Apple({
        scene: this,
        key: Phaser.Math.RND.pick(this.appleGeneratorSeed),
        x: Phaser.Math.Between(50, 610),
        y: Phaser.Math.Between(30, 430),
        speed: 0
    }))
    // overlapTriggered = true;
}

function saveUserScore(){
    const axios = require('axios').default;
    axios.post('http://localhost:3000/registerUserScore',{
        "name": username,
        "score": score
    })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
        console.log(error)
    })
}

function gameOver(scene){
    scene.usernameScene = username;
    scene.player.children.each(function(val, i){
        if(i!=0){
            val.destroy()
        }
        else{
            val.x = 55;
            val.y = 15;
            val.speed = 41;
        }
    })

    sceneStatus = false;
    gameOverStatus = true;
    btn_restart.visible = true;
    restartBtnTxt.visible = true;
    gameOverTxt.visible = true;
    restartBtnTxt.visible=true;
    scene.emmiter.emit("SCORE_ADDED", {"Name":username, "score": score});
    scene.apples.getChildren()[0].visible = false;
    // this.obstacles.getChildren()[0].visible = false;
    // saveUserScore();
}
function restartGame(scene) {
    sceneStatus = true;
    gameOverStatus = false;
    btn_restart.visible = false;
    restartBtnTxt.visible = false;
    gameOverTxt.visible = false;
    restartBtnTxt.visible=false;
    scene.apples.getChildren()[0].x = Phaser.Math.Between(50, 610);
    scene.apples.getChildren()[0].y = Phaser.Math.Between(30, 430);
    
    if(scene.obstacles.countActive()>0){
        console.log(scene.obstacles.countActive())
        scene.obstacles.getChildren()[0].x = Phaser.Math.Between(50, 610);
        scene.obstacles.getChildren()[0].y = Phaser.Math.Between(30, 430);
    }
    scene.applesCount = 0;
    scene.currentDirection = 0;
    emptyGroup(scene.obstacles)
}

function emptyGroup(group){
    group.children.each(function(val, i){
        val.destroy();
    }) 
}
function generateApple(){
   
}
