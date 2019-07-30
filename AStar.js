class AStar 
{
	constructor()
	{
		this.map = [];
		this.openList = [];
		this.closedList = [];
		this.currentNode;
		this.startNode;
		this.finalNode;
		this.collisionNodeIds = [];
		this.path = [];
	}
	setMap(map) 
	{
		this.map = map;
	}
	getNodeById(id)
	{
		let node = {};
		for (let row = 0; row < this.map.length; row++) {
			for (let column = 0; column < this.map[0].length; column++) {
				if (this.map[row][column] === id) {
					node = {
						row: row,
						column: column,
						id: id,
						f: 0,
						h: 0,
						g: 0,
					};
				}
			}
		}
		return node;
	}
	getNode(row, column) {
		return {
			row: row,
			column: column,
			id: map[row][column],
			f: 0,
			h: 0,
			g: 0,
		};
	}
	setStartNodeById(id) 
	{
		this.startNode = this.getNodeById(id);
	}
	setFinalNodeById(id) 
	{
		this.finalNode = this.getNodeById(id);
	}
	setCollisionNodeIds(collisionNodeIds)
	{
		this.collisionNodeIds = collisionNodeIds;
	}
	setCurrentNode()
	{
		this.closedList.push(this.startNode);
		this.currentNode = this.startNode;
	}
	calculateH(node)
	{
		let h = 0;

		if (node.row == this.finalNode.row) {
			if (this.finalNode.column > node.column) {
				h = ( this.finalNode.column - node.column ) * 10;
			} else {
				h = ( node.column - this.finalNode.column ) * 10;
			}
		}

		if (node.column == this.finalNode.column) {
			if (this.finalNode.row > node.row) {
				h = ( this.finalNode.row - node.row ) * 10;
			} else {
				h = ( node.row - this.finalNode.row ) * 10;
			}
		}

		if (node.column != this.finalNode.column && node.row != this.finalNode.row) {
			if (node.row > this.finalNode.row) {
				if (this.finalNode.column > node.column) {
					h = ((node.row - this.finalNode.row) + (this.finalNode.column - node.column)) * 10;
				} else {
					h = ((node.row - this.finalNode.row) + (node.column - this.finalNode.column)) * 10;
				}
			} else {
				if (this.finalNode.column > node.column) {
					h = ((this.finalNode.row - node.row) + (this.finalNode.column - node.column)) * 10;
				} else {
					h = ((this.finalNode.row - node.row) + (node.column - this.finalNode.column)) * 10;
				}
			}
		}

		return h;
	}
	getBestNode()
	{
		let bestNode;
		for (let i = 0; i < this.openList.length; i++) {
			if (!bestNode) {
				bestNode = this.openList[i];
				continue;
			}

			if (bestNode.f >= this.openList[i].f) {
				bestNode = this.openList[i];
			}
		}

		for (let i = 0; i < this.openList.length; i++) {
			if (bestNode.row == this.openList[i].row && bestNode.column == this.openList[i].column) {
				this.openList.splice(i, 1);
			}
		}

		return bestNode;
	}
	getAdjacentNodes()
	{
		const node = {};
		node.row = this.currentNode.row - 1;
		node.column = this.currentNode.column - 1;
		let adjacentNode;
		let found = false;

		for (let row = 0; row < 3; row++) {
			for (let column = 0; column < 3; column++) {
				try {
					adjacentNode = this.getNode(node.row + row, node.column + column);

					if (this.collisionNodeIds.indexOf(adjacentNode.id) > -1) {
						continue;
					}

					for (let i = 0; i < this.openList.length; i++) {
						if ((node.row + row) === this.openList[i].row && (node.column + column)  === this.openList[i].column) {
							found = true;

							if ((column == 0 || column == 2) && (row == 0 || row == 2)) {
							    if (adjacentNode.g + 14 < this.openList[i].g) {
							    	adjacentNode.parent = this.openList[i];
							    	adjacentNode.g = adjacentNode.g + 14;
							    	adjacentNode.h = this.calculateH(adjacentNode);
							    	adjacentNode.f = adjacentNode.g + adjacentNode.h;
							    }
							} else {
								if (adjacentNode.g + 10 < this.openList[i].g) {
							    	adjacentNode.parent = this.openList[i];
							    	adjacentNode.g = adjacentNode.g + 10;
							    	adjacentNode.h = this.calculateH(adjacentNode);
							    	adjacentNode.f = adjacentNode.g + adjacentNode.h;
							    }
							}
						}
					}

					for (let i = 0; i < this.closedList.length; i++) {
						if ((node.row + row) == this.closedList[i].row && (node.column + column) == this.closedList[i].column) {
							found = true;
						}
					}


					if (!found) {
						adjacentNode.h = this.calculateH(adjacentNode);

						if ((column == 0 || column == 2) && (row == 0 || row == 2)) {
							adjacentNode.g = this.currentNode.g + 14;
						} else {
							adjacentNode.g = this.currentNode.g + 10;
						}

						adjacentNode.f = adjacentNode.h + adjacentNode.g;
						adjacentNode.parent = this.currentNode;
						this.openList.push(adjacentNode);
					}

					found = false;


				} catch (error) {
					//..
				}
			}
		}
	}
	findPath()
	{
		let notFound = true;
		while (notFound) {
			this.getAdjacentNodes();
			this.currentNode = this.getBestNode();
			this.closedList.push(this.currentNode);

			if (this.currentNode.row == this.finalNode.row && this.currentNode.column == this.finalNode.column) {
				notFound = false;
				this.finalNode.parent = this.currentNode;
				this.currentNode = this.finalNode;
			}

		}
	}
	buildPath()
	{
		let parent = this.currentNode.parent;
		while (parent) {
			this.path.push(parent);
			parent = parent.parent;
		}
	}
	getPath()
	{
		return this.path;
	}
}
