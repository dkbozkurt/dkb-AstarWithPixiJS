import * as PIXI from 'pixi.js'
import GameBase from '../GameBase.js'
import Cell from './Cell.js'
import EventEmitter from '../Utils/EventEmitter.js'
import Player from './Player.js'
import Target from './Target.js'

let instance = null

export default class GridSystem extends EventEmitter {

    constructor() {

        super()

        if (instance) {
            return instance
        }
        instance = this

        this.gameBase = new GameBase()
        this.sizes = this.gameBase.sizes
        this.resources = this.gameBase.resources
        this.debug = this.gameBase.debug
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

        this.checkIfDebugActive()
        this.addEventListeners()

        this.setup()

        this.helpers()

        this.setInitiallyInValidCells()
    }

    addEventListeners() {
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                this.startPathFinding();
            }
            else if (event.code === 'KeyR') {
                this.resetMap()
            }
        });
    }

    setup() {
        this.createCells()

        this.startCell = this.allCells[0]
        this.endCell = this.allCells[this.allCells.length - 1]
        this.startCell.setAsStart()
        this.endCell.setAsTarget()
        this.player = new Player(this.startCell)
        this.target = new Target(this.endCell)
    }

    update() {
        if (this.player) this.player.update()

        if (this.target) this.target.update()
    }

    destroy() {
        this.allCells.forEach(cell => {
            cell.destroy()
        })

        if (this.player) this.player.destroy()
        if (this.target) this.target.destroy()
    }

    createCells() {

        this.allCells = []
        this.numberOfCells = this.cellsPerRow * this.cellsPerColumn

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

        if (!this.preCheckerForCellsBasedCalculatePath()) return

        if (this.isCalculating) return

        this.resetAllCells()
        this.calculatePath()
    }

    preCheckerForCellsBasedCalculatePath() {
        if (this.startCell == null || this.endCell == null) {
            console.log("You have to assign both \"StartCell\" and \"TargetCell\" for Calculate Path from Cells!");
            return false;
        }
        if (!this.endCell.isValid) {
            console.log("\"TargetCell\" is not a valid cell to move!");
            return false;
        }
        if (this.startCell.Id == this.endCell.Id) {
            console.log("\"StartCell\" and \"TargetCell\" are can not be the same cell.");
            return false;
        }

        return true;
    }

    async calculatePath() {

        this.isCalculating = true

        this.openList = []
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
                console.log("No Path Found");
                this.isCalculating = false;
                return;
            }

            // Add all cells adjacent to currentCell to openList
            for (const cell of this.getAdjacentCells(currentCell)) {
                const tentativeG = currentCell.gScore + this.distance(currentCell.cellModel.x, currentCell.cellModel.y, cell.cellModel.x, cell.cellModel.y);

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

        // TODO Line renderer part! Draw Path

        this.trigger('onPathGenerated', path);

        this.isCalculating = false;
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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

    checkIfDebugActive() {
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Grid System')
        }
    }

    helpers() {
        if (!this.debug.active) return

        this.debugObject = {
            canMoveDiagonally: false,
            gridSize: { rows: this.cellsPerRow, columns: this.cellsPerColumn },
            startCellIndex: 0,
            endCellIndex: this.numberOfCells - 1,
            resetMap: () => this.resetMap(),
            startPathFinding: () => this.startPathFinding(),
        }

        this.debugFolder
            .add(this.debugObject, 'canMoveDiagonally')
            .name('Can Move Diagonally')
            .onChange((value) => {
                this.canMoveDiagonally = value
            })

        const startCellIndexHolder = this.debugFolder
            .add(this.debugObject, 'startCellIndex')
            .name('Start Cell Index')
            .min(0)
            .max(this.allCells.length - 1)
            .step(1)
            .onChange((value) => {
                this.startCell.reset()
                this.endCell.setAsTarget()

                this.startCell = this.allCells[value]
                this.startCell.setAsStart()
                this.player.setModelPositionToCell(this.startCell)
            })

        const endCellIndexHolder = this.debugFolder
            .add(this.debugObject, 'endCellIndex')
            .name('End Cell Index')
            .min(0)
            .max(this.allCells.length - 1)
            .step(1)
            .onChange((value) => {
                this.endCell.reset()
                this.startCell.setAsStart()

                this.endCell = this.allCells[value]
                this.endCell.setAsTarget()
                this.target.setModelPositionToCell(this.endCell)
            })

        this.debugFolder
            .add(this.debugObject.gridSize, 'columns')
            .name('Rows')
            .min(2)
            .max(25)
            .step(1)
            .onChange((value) => {
                this.destroy()

                this.cellsPerColumn = value
                this.createCells()
                this.debugObject.endCellIndex = this.allCells.length - 1
                endCellIndexHolder.updateDisplay()
                endCellIndexHolder.max(this.allCells.length - 1)
                startCellIndexHolder.max(this.allCells.length - 1)

                this.allCells[0].setAsStart()
                this.player.setModelPositionToCell(this.startCell)

                this.allCells[this.allCells.length - 1].setAsTarget()
                this.target.setModelPositionToCell(this.endCell)
            })

        this.debugFolder
            .add(this.debugObject.gridSize, 'rows')
            .name('Columns')
            .min(2)
            .max(25)
            .step(1)
            .onChange((value) => {
                this.destroy()

                this.cellsPerRow = value
                this.createCells()
                this.debugObject.endCellIndex = this.allCells.length - 1
                endCellIndexHolder.updateDisplay()
                endCellIndexHolder.max(this.allCells.length - 1)
                startCellIndexHolder.max(this.allCells.length - 1)

                this.allCells[0].setAsStart()
                this.player.setModelPositionToCell(this.startCell)

                this.allCells[this.allCells.length - 1].setAsTarget()
                this.target.setModelPositionToCell(this.endCell)
            })

        this.debugFolder
            .add(this.debugObject, 'resetMap')
            .name('Reset Map')

        this.debugFolder
            .add(this.debugObject, 'startPathFinding')
            .name('Start Path Finding')
    }

    resetMap() {
        this.resetAllCells()
        this.startCell.setAsStart()
        this.endCell.setAsTarget()

        this.player.setModelPositionToCell(this.startCell)
        this.target.setModelPositionToCell(this.endCell)
    }

    setInitiallyInValidCells() {

        const invalidCellIds = [15, 17, 19, 22, 24, 29, 30, 31, 33, 36, 38, 40, 43, 45, 47]
        for (let i = 0; i < this.allCells.length; i++) {
            for (let j = 0; j < invalidCellIds.length; j++) {
                if (i !== invalidCellIds[j]) continue

                this.allCells[i].setValidity(false)
            }

        }
    }
}