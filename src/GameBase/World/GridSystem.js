import * as PIXI from 'pixi.js'
import GameBase from '../GameBase.js'
import Cell from './Cell.js'

let instance = null

export default class GridSystem {

    constructor() {

        if (instance) {
            return instance
        }
        instance = this

        this.gameBase = new GameBase()
        this.sizes = this.gameBase.sizes
        this.resources = this.gameBase.resources
        this.scene = this.gameBase.scene

        this.cellsPerRow = 7
        this.cellsPerColumn = 9
        this.initialXOffSet = 50
        this.initialYOffSet = 50
        this.gridIncrementValue = 75
        this.canMoveDiagonally = false

        this.startCell = null;
        this.endCell = null;

        this.allCells = []
        this.openList = []
        this.closedList = []

        this.isCalculating = false

        this.setup()
    }

    setup() {
        this.createCells()
    }

    update() { }

    destroy() { }

    createCells() {

        let ySpacing = 0
        let counter = 0

        for (let i = 0; i < this.cellsPerRow * this.cellsPerColumn; i++) {

            const cell = new Cell(
                this.initialXOffSet + this.gridIncrementValue * counter,
                this.initialYOffSet + ySpacing,
            )

            cell.Id = i
            this.allCells.push(cell)

            counter += 1

            if (counter >= this.cellsPerRow) {
                counter = 0
                ySpacing += this.gridIncrementValue
            }
        }
    }

    startPathFinding() {

        if (this.isCalculating) return
        if (this.preCheckerForCellsBasedCalculatePath()) return

        console.log('Processing...');

        this.resetAllCells()
        this.calculatePath()
    }

    preCheckerForCellsBasedCalculatePath() {
        if (this.startCell == null || this.endCell == null) {
            console.log("You have to assign both \"StartCell\" and \"TargetCell\" for Calculate Path from Cells!");
            return false;
        }
        else if (!this.endCell.IsValid) {
            console.log("\"TargetCell\" is not a valid cell to move!");
            return false;
        }
        else if (this.startCell.Id == this.endCell.Id) {
            console.log("\"StartCell\" and \"TargetCell\" are can not be the same cell.");
            return false;
        }

        return true;
    }

    async calculatePath() {

        this.isCalculating = true

        console.log('Waiting for 2 seconds...');
        await this.wait(2000); // Wait for 2000 milliseconds (2 seconds)
        console.log('2 seconds passed.');

        // TODO if you wanna do yield break just use 'return'
        console.log('Waiting for the next frame...');
        await this.waitForNextFrame(); // Wait for the next animation frame

        console.log('Next frame reached.');

        this.isCalculating = false
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Function to wait for one frame
    waitForNextFrame() {
        return new Promise(resolve => requestAnimationFrame(resolve));
    }

    getAdjacentCells(currentCell) {
        return currentCell.getAdjacentCells()
    }

    addCellToClosedList(cellToAdd) {
        this.closedList.push(cellToAdd)
        cellToAdd.setToClosedList()
    }

    addCellToOpenList(cellToAdd) {
        this.openList.push(cellToAdd)
        cellToAdd.setToOpenList()
    }

    resetAllCells() {
        this.allCells.forEach(cell => {
            cell.reset()
        })
    }

    resetCell(targetCell) {
        targetCell && targetCell.reset()
    }

    isCellValid(targetCell) {
        return targetCell && targetCell.isValid
    }

    isEditableCell(targetCell) {
        if (targetCell === this.startCell || targetCell === this.endCell) return false

        return true
    }
}