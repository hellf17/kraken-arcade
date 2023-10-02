const canvas = document.getElementById('nebulaCanvas');
const ctx = canvas.getContext('2d');

const scale = 5;
const threshold = 0.75;
const roomCount = 10; // Number of rooms to generate

const noise = new SimplexNoise();

function generateNebulaMap(width, height, scale) {
    let nebulaMap = [];

    for (let y = 0; y < height; y++) {
        let row = [];
        for (let x = 0; x < width; x++) {
            let value = noise.noise2D(x / scale, y / scale) * 0.5 + 0.5;
            row.push(value);
        }
        nebulaMap.push(row);
    }

    return nebulaMap;
}

function applyThreshold(nebulaMap, threshold) {
    for (let y = 0; y < nebulaMap.length; y++) {
        for (let x = 0; x < nebulaMap[y].length; x++) {
            nebulaMap[y][x] = nebulaMap[y][x] > threshold ? 1 : 0;
        }
    }
    return nebulaMap;
}

function generateRoomCoordinates(nebulaMap) {
    let rooms = [];

    for (let i = 0; i < roomCount; i++) {
        let roomWidth = Math.floor(Math.random() * 5) + 3; // Random width between 3 and 7
        let roomHeight = Math.floor(Math.random() * 5) + 3; // Random height between 3 and 7

        let x = Math.floor(Math.random() * (nebulaMap[0].length - roomWidth));
        let y = Math.floor(Math.random() * (nebulaMap.length - roomHeight));

        let room = {
            x: x,
            y: y,
            width: roomWidth,
            height: roomHeight,
            entranceX: x + Math.floor(Math.random() * roomWidth),
            entranceY: y + Math.floor(Math.random() * roomHeight)
        };

        rooms.push(room);
    }

    return rooms;
}

function markRoomsAndEntrances(nebulaMap, rooms) {
    rooms.forEach(room => {
        for (let i = room.y; i < room.y + room.height; i++) {
            for (let j = room.x; j < room.x + room.width; j++) {
                if (i === room.entranceY && j === room.entranceX) {
                    nebulaMap[i][j] = 2; // Mark entrance with 2
                } else {
                    nebulaMap[i][j] = 1; // Mark room cells with 1
                }
            }
        }
    });
}

// Generate nebula map and draw nebulae
const nebulaMap = generateNebulaMap(canvas.width / scale, canvas.height / scale, scale);
const thresholdedMap = applyThreshold(nebulaMap, threshold);
const rooms = generateRoomCoordinates(thresholdedMap);
markRoomsAndEntrances(nebulaMap, rooms);

// Draw the entire nebula map (for visualization)
function drawNebulaMap(map) {
    ctx.fillStyle = 'black'; // Empty space color
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 1) {
                ctx.fillRect(x * scale, y * scale, scale, scale);
            }
        }
    }
}

drawNebulaMap(nebulaMap);

// Draw rooms and entrances (for visualization)
ctx.fillStyle = 'blue'; // Room color
ctx.strokeStyle = 'red'; // Entrance color
ctx.lineWidth = 2;

rooms.forEach(room => {
    ctx.fillRect(room.x * scale, room.y * scale, room.width * scale, room.height * scale);
    ctx.beginPath();
    ctx.arc((room.entranceX + 0.5) * scale, (room.entranceY + 0.5) * scale, scale * 0.5, 0, 2 * Math.PI);
    ctx.stroke();
});