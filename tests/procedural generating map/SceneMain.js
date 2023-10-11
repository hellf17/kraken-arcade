class SceneMain extends Phaser.Scene {
    constructor() {
        super({ key: 'SceneMain' });
        this.mapWidth = 7680; // Width of the map (8K)
        this.mapHeight = 4320; // Height of the map (8K)
        this.followPoint = new Phaser.Math.Vector2();
    }
    
    preload() {
        this.load.spritesheet('sprSpace', '../../tests/procedural generating map/sprSpace.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('sprStars', '../../tests/procedural generating map/sprStars.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image('sprAsteroids', '../../tests/procedural generating map/sprAsteroids.png');
    }
    
    create() {
        this.anims.create({
            key: 'sprSpace',
            frames: this.anims.generateFrameNumbers('sprSpace'),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: 'sprStars',
            frames: this.anims.generateFrameNumbers('sprStars'),
            frameRate: 5,
            repeat: -1
        });
        
        this.chunkSize = 16;
        this.tileSize = 16;
        this.cameraSpeed = 3;
        
        this.cameras.main.setZoom(2);

        // Set camera bounds to match the map size
        this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);

        // Set initial follow point within the bounds of the map
        this.followPoint.x = Phaser.Math.Clamp(this.followPoint.x, this.chunkSize * this.tileSize, this.mapWidth - this.chunkSize * this.tileSize);
        this.followPoint.y = Phaser.Math.Clamp(this.followPoint.y, this.chunkSize * this.tileSize, this.mapHeight - this.chunkSize * this.tileSize);
        
        this.chunks = [];
        
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }
    
    getChunk(x, y) {
        var chunk = null;

        // Retrieve the chunk at a specific X, Y position
        for (var i = 0; i < this.chunks.length; i++) {
            if (this.chunks[i].x == x && this.chunks[i].y == y) {
                chunk = this.chunks[i];
            }
        }
        
        return chunk;
    }
    
    update() {
        // Get's the chunk position the follow point is in
        var snappedChunkX = (this.chunkSize * this.tileSize) * Math.round(this.followPoint.x / (this.chunkSize * this.tileSize));
        var snappedChunkY = (this.chunkSize * this.tileSize) * Math.round(this.followPoint.y / (this.chunkSize * this.tileSize));

        snappedChunkX = snappedChunkX / this.chunkSize / this.tileSize;
        snappedChunkY = snappedChunkY / this.chunkSize / this.tileSize;


        // Create chunks around this chunk position if they do not exist yet
        for (var x = snappedChunkX - 2; x < snappedChunkX + 2; x++) {
            for (var y = snappedChunkY - 2; y < snappedChunkY + 2; y++) {
                var existingChunk = this.getChunk(x, y);
        
                if (existingChunk == null) {
                    var newChunk = new Chunk(this, x, y);
                    this.chunks.push(newChunk);
                }
            }
        }

        // Remove chunks that are not being rendered
        for (var i = 0; i < this.chunks.length; i++) {
            var chunk = this.chunks[i];
        
            if (Phaser.Math.Distance.Between(
                snappedChunkX,
                snappedChunkY,
                chunk.x,
                chunk.y
            ) < 3) {
                if (chunk !== null) {
                    chunk.load();
                }
            }
            else {
                if (chunk !== null) {
                    chunk.unload();
                }
            }
        }

        // Move the follow point
        if (this.keyW.isDown) {
            this.followPoint.y -= this.cameraSpeed;
        }
        if (this.keyS.isDown) {
            this.followPoint.y += this.cameraSpeed;
        }
        if (this.keyA.isDown) {
            this.followPoint.x -= this.cameraSpeed;
        }
        if (this.keyD.isDown) {
            this.followPoint.x += this.cameraSpeed;
        }

        // Move the follow point within the bounds of the map
        this.followPoint.x = Phaser.Math.Clamp(this.followPoint.x, this.chunkSize * this.tileSize, this.mapWidth - this.chunkSize * this.tileSize);
        this.followPoint.y = Phaser.Math.Clamp(this.followPoint.y, this.chunkSize * this.tileSize, this.mapHeight - this.chunkSize * this.tileSize);

        // Center the camera on the follow point
        this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y);

    }
}