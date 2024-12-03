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
        this.numberOfCells = this.cellsPerRow * this.cellsPerColumn
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

        console.log('Processing...');

        if (this.isCalculating) return
        if (this.preCheckerForCellsBasedCalculatePath()) return

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

        this.openList =[]
        this.closedList = []

        let currentCell = this.startCell;
        this.addCellToClosedList(currentCell);

        const cycleDelay = 0.0; // in seconds
        let cycleCounter = 0;

        while (currentCell.Id !== this.endCell.Id) {
            await this.wait(cycleDelay * 1000);

            // Safety-abort in case of endless loop
            cycleCounter++;
            if (cycleCounter >= this.numberOfCells) {

                // TODO Here should be an event!
                // this.OnNoPathFound();

                console.log("No Path Found");
                this.isCalculating = false;
                return;
            }

            // Add all cells adjacent to currentCell to openList
            for (const cell of this.getAdjacentCells(currentCell)) {
                const tentativeG = currentCell.gScore + this.distance(currentCell.cellModel.x,currentCell.cellModel.y, cell.cellModel.x, cell.cellModel.y);

                // If cell is on closed list skip to next cycle
                if (cell.isOnClosedList && tentativeG > cell.gScore) {
                    continue;
                }

                if (!cell.isOnOpenList || tentativeG < cell.gScore) {
                    cell.calculateHScore(this.endCell);
                    cell.gScore = tentativeG;
                    cell.fScore = cell.gScore + cell.hScore;
                    cell.parentCell = currentCell;

                    if (!cell.isOnClosedList) {
                        this.addCellToOpenList(cell);
                    }
                }
            }

            await this.wait(cycleDelay * 1000);

            // Get cell with lowest F value from openList, set it to currentCell
            let lowestFValue = Infinity;
            for (const cell of this.openList) {
                if (cell.fScore < lowestFValue) {
                    lowestFValue = cell.fScore;
                    currentCell = cell;
                }
            }

            // remove currentCell from openList, add to closedList
            this.openList.splice(this.openList.indexOf(currentCell), 1);
            this.addCellToClosedList(currentCell);
        }

        // Get Path
        const path = [];
        currentCell = this.endCell;
        while (currentCell.Id !== this.startCell.Id) {
            path.push(currentCell);
            currentCell = currentCell.parentCell;
        }
        path.push(currentCell);
        path.reverse();

        // TODO Line renderer part!
        // DrawPath
        // drawPath(path);

        // if (onPathGenerated) onPathGenerated(path);

        this.isCalculating = false;
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

    distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
}