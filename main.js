function getTile(row, column, map, tiles, grid_rows, grid_cols) {
	if (row > grid_rows) {
		throw new Error('The row ' + row + ' is out of bounds');
	}

	if (column > grid_cols) {
		throw new Error('The column ' + row + ' is out of bounds');
	}

	result = {
		row: row,
		column: column,
		id: undefined,
		walkable: undefined,
	};

	if (tiles.has(map[row][column])) {
		tile = tiles.get(map[row][column]);
		result.h = 0;
		result.g = 0;
		result.f = 0;

		result.walkable = tile.walkable;
		result.id = map[row][column];
	}

	return result;
 
}

function getTileFromId(id, map, tiles, grid_rows, grid_cols) {
	for (let row = 0; row < grid_rows; row++) {
		for (let column = 0; column < grid_cols; column++) {
			if (map[row][column] == id) {
				result = {
					row: row,
					column: column,
					id: undefined,
					walkable: undefined,
				};
				result.h = 0;
				result.g = 0;
				result.f = 0;

				if (tiles.has(map[row][column])) {
					tile = tiles.get(map[row][column]);

					result.walkable = tile.walkable;
					result.id = map[row][column];
				}

				return result;
			}
		}
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

function calculateH(node, finalNode) {
	let h = 0;

	if (node.row == finalNode.row) {
		if (finalNode.column > node.column) {
			h = ( finalNode.column - node.column ) * 10;
		} else {
			h = ( node.column - finalNode.column ) * 10;
		}
	}

	if (node.column == finalNode.column) {
		if (finalNode.row > node.row) {
			h = ( finalNode.row - node.row ) * 10;
		} else {
			h = ( node.row - finalNode.row ) * 10;
		}
	}

	if (node.column != finalNode.column && node.row != finalNode.row) {
		if (node.row > finalNode.row) {
			if (finalNode.column > node.column) {
				h = ((node.row - finalNode.row) + (finalNode.column - node.column)) * 10;
			} else {
				h = ((node.row - finalNode.row) + (node.column - finalNode.column)) * 10;
			}
		} else {
			if (finalNode.column > node.column) {
				h = ((finalNode.row - node.row) + (finalNode.column - node.column)) * 10;
			} else {
				h = ((finalNode.row - node.row) + (node.column - finalNode.column)) * 10;
			}
		}
	}

	return h;
}

function getAdjacentNodes(currentNode, finalNode, openList, closedList, map, tiles, grid_rows, grid_cols) {
	const node = {};
	node.row = currentNode.row - 1;
	node.column = currentNode.column - 1;
	let tile;
	let found = false;

	for (row = 0; row < 3; row++) {
		for (column = 0; column < 3; column++) {
			try {
				tile = getTile(node.row + row, node.column + column, map, tiles, grid_rows, grid_cols);

				if (typeof(tile.walkable) === undefined || !tile.walkable) {
					continue;
				}

				for (let i = 0; i < openList.length; i++) {
					if ((node.row + row) === openList[i].row && (node.column + column)  === openList[i].column) {
						found = true;

						if ((column == 0 || column == 2) && (row == 0 || row == 2)) {
						    if (tile.g + 14 < openList[i].g) {
						    	tile.parent = openList[i];
						    	tile.g = tile.g + 14;
						    	tile.h = calculateH(tile, finalNode);
						    	tile.f = tile.g + tile.h;
						    }
						} else {
							if (tile.g + 10 < openList[i].g) {
						    	tile.parent = openList[i];
						    	tile.g = tile.g + 10;
						    	tile.h = calculateH(tile, finalNode);
						    	tile.f = tile.g + tile.h;
						    }
						}
					}
				}

				for (let i = 0; i < closedList.length; i++) {
					if ((node.row + row) == closedList[i].row && (node.column + column) == closedList[i].column) {
						found = true;
					}
				}


				if (!found) {
					tile.h = calculateH(tile, finalNode);

					if ((column == 0 || column == 2) && (row == 0 || row == 2)) {
						tile.g = currentNode.g + 14;
					} else {
						tile.g = currentNode.g + 10;
					}

					tile.f = tile.h + tile.g;
					tile.parent = currentNode;
					openList.push(tile);
				}

				found = false;


			} catch (error) {
				//..
			}
		}
	}
}

function getNextCurrentNode(openList) {
	let bestNode;
	for (let i = 0; i < openList.length; i++) {
		if (!bestNode) {
			bestNode = openList[i];
			continue;
		}

		if (bestNode.f >= openList[i].f) {
			bestNode = openList[i];
		}
	}

	for (let i = 0; i < openList.length; i++) {
		if (bestNode.row == openList[i].row && bestNode.column == openList[i].column) {
			openList.splice(i, 1);
		}
	}

	return bestNode;
}


function getCenterPoint(node) {
	x = ( node.column * 40 ) + 20;
	y = (node.row* 40 ) + 20;

	return {x: x, y: y};
}


const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');
// the map used for this project, there can only be one destionation and one starting point, you can add as many walls you like
const map = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
	[0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 0, 1, 1, 1, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
];
const grid_rows = map.length;
const grid_cols = map[0].length;
const tile_size = 40;
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

const openList = [];
const closedList = [];
/*------------------CHANGE THESE TO GET THE START AND END POSITION FROM MAP----------------- */
let currentNode = getTileFromId(2, map, tiles, grid_rows, grid_cols)
const finalNode = getTileFromId(3, map, tiles, grid_rows, grid_cols)
closedList.push(currentNode);


drawGrid(context, grid_rows, grid_cols, tile_size);
drawMap(map, context, grid_rows, grid_cols, tile_size);

// create the path
let notFound = true;
while (notFound) {
	getAdjacentNodes(currentNode, finalNode, openList, closedList, map, tiles, grid_rows, grid_cols);
	currentNode = getNextCurrentNode(openList);
	closedList.push(currentNode);
	drawMap(map, context, grid_rows, grid_cols, tile_size);	

	if (currentNode.row == finalNode.row && currentNode.column == finalNode.column) {
		notFound = false;
		finalNode.parent = currentNode;
		currentNode = finalNode;
	}

}

let parent = currentNode.parent;
const nodeshPath = [];

while (parent) {
	if (map[parent.row][parent.column] === 0) {
		map[parent.row][parent.column] = 9;
	}
	
	nodeshPath.push(parent);
	parent = parent.parent;
}
drawMap(map, context, grid_rows, grid_cols, tile_size);

nodeshPath.reverse();

// draw lines from one node to the next one
let center;
let nextCenter;
for (let i = 0; i < nodeshPath.length; i++) {
	if (!center) {
	    center = getCenterPoint(nodeshPath[i]);
	    continue;
	} else {
		nextCenter = getCenterPoint(nodeshPath[i]);
		context.strokeStyle = 'red';
		context.beginPath();
		context.moveTo(center.x, center.y);
		context.lineTo(nextCenter.x, nextCenter.y);
		context.stroke();

		center = nextCenter;
		nextCenter = undefined;
	}
	
}



if (!notFound) {
	alert('found');
}




