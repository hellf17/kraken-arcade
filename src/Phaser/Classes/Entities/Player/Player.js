import Phaser from "phaser";
import { createMachine, interpret } from "xstate";

export default class Player extends Phaser.Physics.Arcade.Sprite {

    //Initialize the player's stats and any associated variables

    constructor(scene, x, y, texture, frame) {
        this.xp = 0;
        this.timeSurvived = 0
        super(scene, x, y, texture, frame);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        //this.scene.physics.world.enable(this);
        this.setDragX(1000);
        this.setDepth(2);

        this.anims.play('player-idle', true);

        this.hitPoints = 100
        this.isAlive = true
        this.isHit = false
        this.isAttacking = false

        /*
        this.moveState = createMachine({})
        this.animState = createMachine({})
        */

        this.setOrigin(0.5, 1);
        this.setCollideWorldBounds(true);
        this.body.setSize(50, 100);
        this.body.setOffset(50, 0);
        this.setScale(2);
        this.setMaxVelocity(300, 300);

        this.setupKeys();
        /*
        this.setupAnimations();
        this.setupMovemement();
        */
    }

    //Add the function for incrementing the player's XP and time survived
    /*
    timeSurvived(){

         //Check if the player is not dead
        //If the player isAlive is true, then add to the timeSurvived
        //If the player is dead, then stop adding to the timeSurvived

        //This function should only check every second, so we will need to add a timer to it.

        //Check the player's alive status, and update every second
        this.player.timeSurvived += 1;
        //The time survived should be measured in seconds
        //Every 10 seconds, the player should gain 1 XP
    }
    */

    //Set up the player controls for the user to make actions within the game
    setupKeys() {

        this.keys = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            attack: Phaser.Input.Keyboard.KeyCodes.SPACE
        });
        this.input = {};
        this.input.didPressJump = Phaser.Input.Keyboard.JustDown(this.keys.up);
        this.keyboard = this.scene.input.keyboard;
    }

    //Set up the attack method for the player
    attack() {
        
    }

    kill(){
        this.moveState.die();
        this.animState.die();
        this.isAlive = false;
        events.emit("player-died")
        const styles = ["font size: 18px", "padding: 2px 4px", "background-color: #000000"].join(";");


        this.setVelocityY(-300);
    }

    update(){

        this.timeSurvived += 1;
        
    }

}