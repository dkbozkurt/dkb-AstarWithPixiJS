import * as PIXI from 'pixi.js'
import GameBase from '../GameBase.js'
import GridSystem from './GridSystem.js'

export default class Cell {

    constructor(x, y) {
        this.gameBase = new GameBase()
        this.sizes = this.gameBase.sizes
        this.resources = this.gameBase.resources
        this.scene = this.gameBase.scene
        this.gridSystem = new GridSystem()

        this.cellModel = new PIXI.Sprite(this.resources.items["cellTexture"])
        this.cellModel.scale.set(0.5, 0.5)

        // Set anchor point to the center for proper rotation
        this.cellModel.anchor.set(0.5);

        this.Id = -1
        this.isValid = true

        this.blockedCells = []

        this.colors = {}
        this.colors.valid = 0x9290FF
        this.colors.inValid = 0x8B0000
        this.colors.start = 0xFFFFFF
        this.colors.target = 0x000000
        this.colors.onClosedList = 0x2513FF
        this.colors.onOpenList = 0xB8B2FF

        this.setCellColor(this.colors.valid)

        this.isOnOpenList = false
        this.isOnClosedList = false

        this.fScore = 0
        this.gScore = 0
        this.hScore = 0

        this.cellModel.eventMode = 'static'
        this.cellModel.cursor = 'pointer'

        this.parentCell = null

        this.cellModel.on('pointertap', () => {
            if (!this.gridSystem.isEditableCell(this)) return

            this.setValidity(!this.isValid)
        })

        this.setup(x, y)
    }

    setup(xCoord, yCoord) {

        this.cellModel.x = xCoord
        this.cellModel.y = yCoord

        this.scene.add(this.cellModel)
    }

    reset() {
        this.parentCell = null

        this.fScore = 0
        this.gScore = 0
        this.hScore = 0

        this.isOnOpenList = false
        this.isOnClosedList = false

        this.setCellColor(this.isValid ? this.colors.valid : this.colors.inValid)
    }

    setValidity(status) {
        this.isValid = status
        this.setCellColor(this.isValid ? this.colors.valid : this.colors.inValid)
    }

    setAsStart() {
        this.gridSystem.resetCell(this.gridSystem.startCell)
        this.gridSystem.startCell = this
        this.isValid = true
        this.setCellColor(this.colors.start)
    }

    setAsTarget() {
        this.gridSystem.resetCell(this.gridSystem.endCell)
        this.gridSystem.endCell = this
        this.isValid = true
        this.setCellColor(this.colors.target)
    }

    setToClosedList() {
        this.isOnClosedList = true
        this.isOnOpenList = false
        this.setCellColor(this.colors.onClosedList)
    }

    setToOpenList() {
        this.isOnOpenList = true
        this.setCellColor(this.colors.onOpenList)
    }

    setCellColor(targetColor) {
        this.currentColor = targetColor
        this.cellModel.tint = targetColor
    }

    getAdjacentCells() {
        let adjacentCells = []

        let neighborUpper = null;
        let neighborRight = null;
        let neighborLower = null;
        let neighborLeft = null;

        let neighborUpperLeft = null;
        let neighborUpperRight = null;
        let neighborLowerLeft = null;
        let neighborLowerRight = null;

        if (this.gridSystem.canMoveDiagonally &&
            (this.Id % this.gridSystem.cellsPerRow != 0 && this.isInBounds(this.Id + this.gridSystem.cellsPerRow - 1, this.gridSystem.allCells)))
            neighborUpperLeft = this.gridSystem.allCells[this.Id + this.gridSystem.cellsPerRow - 1];

        if (this.isInBounds(this.Id + this.gridSystem.cellsPerRow, this.gridSystem.allCells))
            neighborUpper = this.gridSystem.allCells[this.Id + this.gridSystem.cellsPerRow];

        if (this.gridSystem.canMoveDiagonally &&
            ((this.Id + 1) % this.gridSystem.cellsPerRow != 0 && this.isInBounds(this.Id + this.gridSystem.cellsPerRow + 1, this.gridSystem.allCells)))
            neighborUpperRight = this.gridSystem.allCells[this.Id + this.gridSystem.cellsPerRow + 1];

        if ((this.Id + 1) % this.gridSystem.cellsPerRow != 0)
            neighborRight = this.gridSystem.allCells[this.Id + 1];

        if (this.Id % this.gridSystem.cellsPerRow != 0)
            neighborLeft = this.gridSystem.allCells[this.Id - 1];

        if (this.gridSystem.canMoveDiagonally && (this.Id % this.gridSystem.cellsPerRow != 0 && this.isInBounds(this.Id - this.gridSystem.cellsPerRow - 1, this.gridSystem.allCells)))
            neighborLowerLeft = this.gridSystem.allCells[this.Id - this.gridSystem.cellsPerRow - 1];

        if (this.isInBounds(this.Id - this.gridSystem.cellsPerRow, this.gridSystem.allCells))
            neighborLower = this.gridSystem.allCells[this.Id - this.gridSystem.cellsPerRow];

        if (this.gridSystem.canMoveDiagonally && ((this.Id + 1) % this.gridSystem.cellsPerRow != 0 && this.isInBounds(this.Id - this.gridSystem.cellsPerRow + 1, this.gridSystem.allCells)))
            neighborLowerRight = this.gridSystem.allCells[this.Id - this.gridSystem.cellsPerRow + 1];

        // If neighbor exists and is valid, add to neighbor-list
        if (this.gridSystem.isCellValid(neighborRight) && this.checkIfNeighborCellIsBlocked(neighborRight) == false)
            adjacentCells.push(neighborRight);

        if (this.gridSystem.isCellValid(neighborLeft) && this.checkIfNeighborCellIsBlocked(neighborLeft) == false)
            adjacentCells.push(neighborLeft);

        if (this.gridSystem.canMoveDiagonally && (this.gridSystem.isCellValid(neighborUpperRight) &&
            this.checkIfNeighborCellIsBlocked(neighborUpperRight) == false)) {
            adjacentCells.push(neighborUpperRight);
        }

        if (this.gridSystem.isCellValid(neighborUpper) && this.checkIfNeighborCellIsBlocked(neighborUpper) == false)
            adjacentCells.push(neighborUpper);

        if (this.gridSystem.canMoveDiagonally && (this.gridSystem.isCellValid(neighborUpperLeft) &&
            this.checkIfNeighborCellIsBlocked(neighborUpperLeft) == false)) {
            adjacentCells.push(neighborUpperLeft);
        }

        if (this.gridSystem.canMoveDiagonally && (this.gridSystem.isCellValid(neighborLowerRight) &&
            this.checkIfNeighborCellIsBlocked(neighborLowerRight) == false)) {
            adjacentCells.push(neighborLowerRight);
        }

        if (this.gridSystem.isCellValid(neighborLower) && this.checkIfNeighborCellIsBlocked(neighborLower) == false)
            adjacentCells.push(neighborLower);

        if (this.gridSystem.canMoveDiagonally && (this.gridSystem.isCellValid(neighborLowerLeft) &&
            this.checkIfNeighborCellIsBlocked(neighborLowerLeft) == false)) {
            adjacentCells.push(neighborLowerLeft);
        }

        return adjacentCells;
    }

    calculateHScore(targetCell) {
        this.hScore = Math.abs(targetCell.cellModel.x - this.cellModel.x) + Math.abs(targetCell.cellModel.y - this.cellModel.y)
    }

    isInBounds(index, cells) {
        return (index >= 0 && index < cells.length)
    }

    checkIfNeighborCellIsBlocked(targetCell) {
        if (this.blockedCells.length <= 0) return false

        if (this.blockedCells.includes(targetCell)) return true
    }

    update() { }

    destroy() {
        this.reset()
        this.cellModel.destroy()
    }
}