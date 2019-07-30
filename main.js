const tiles = new Map();
// this ID represents walkable space
tiles.set(0, {
	color: '#222',
	walkable: true
});
/* THIS IS THE WALL ID */
tiles.set(1, {
	color: 'red',
	walkable: false
});
/* THIS IS THE STARTING POINT ID */
tiles.set(2, {
	color: 'blue',
	walkable: true
});
/* THIS IS THE END POINT ID */
tiles.set(3, {
	color: 'green',
	walkable: true
});
/* THIS IS THE FINAL PATH ID */
tiles.set(9, {
	color: 'orange',
	walkable: true
});
const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');
const map = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 3, 0, 0],
];
const aStar = new AStar();
aStar.setMap(map);
aStar.setStartNodeById(2);
aStar.setFinalNodeById(3);
aStar.setCollisionNodeIds([1]);
aStar.setCurrentNode()

aStar.findPath();
aStar.buildPath();
const path = aStar.getPath();

for (let i = 0; i < path.length; i++) {
	if (map[path[i].row][path[i].column] == 0) {
		map[path[i].row][path[i].column] = 9;
	}
}

function drawGrid(context, grid_rows, grid_cols, tile_size) {
	context.lineWidth = 2;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur    = 1;
    context.shadowColor   = "#ccc";

    for (let i = 0; i <= grid_cols; i++) {
      context.strokeStyle = '#3FC380';
      context.beginPath();
      context.moveTo(tile_size * i, 0);
      context.lineTo(tile_size * i, tile_size * grid_rows);
      context.stroke();
    }

    for (let j = 0; j <= grid_rows; j++) {
      context.strokeStyle = '#3FC380';
      context.beginPath();
      context.moveTo(0, tile_size * j);
      context.lineTo(tile_size * grid_cols, tile_size * j);
      context.stroke();
    }
}


function drawMap(map, context, grid_rows, grid_cols, tile_size) {
	let tile;
	for (let row = 0; row < grid_rows; row++) {
		for (let column = 0; column < grid_cols; column++) {
			if (tiles.has(map[row][column]) && map[row][column] != 0) {
				tile = tiles.get(map[row][column]);
				context.fillStyle = tile.color;
				context.fillRect(column * tile_size, row * tile_size, tile_size, tile_size);
			}
		}
	}
}


drawMap(map, context, map.length, map[0].length, 40);
drawGrid(context, map.length, map[0].length, 40);



