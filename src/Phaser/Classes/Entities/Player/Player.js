import Phaser from "phaser";
import { createMachine, interpret } from "xstate";

export default class Player extends Phaser.Physics.Arcade.Sprite {

    //Initialize the player's stats and any associated variables

   hitPoints = 100
   isAlive = true
   isHit = false
   isAttacking = false

   moveState = createMachine({})
   animState = createMachine({})

    constructor(scene, x, y, texture) {
        super(scene, x, y, 'player1', 0);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        this.setDragX(1000);
        this.setDepth(2);

        this.setOrigin(0.5, 1);
        this.setCollideWorldBounds(true);
        this.body.setSize(50, 100);
        this.body.setOffset(50, 0);
        this.setScale(2);
        this.setMaxVelocity(300, 300);

        this.setupKeys();
        this.setupAnimations();
        this.setupMovemement();
    }

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

    kill(){
        this.moveState.die();
        this.animState.die();
        this.isAlive = false;
        events.emit("player-died")
        const styles = ["font size: 18px", "padding: 2px 4px", "background-color: #000000"].join(";");


        this.setVelocityY(-300);
    }

}