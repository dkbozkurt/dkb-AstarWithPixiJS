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

        this.cellsPerRow = 6
        this.cellsPerColumn = 10
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

    resetCell(targetCell)
    {
        targetCell && targetCell.reset()
    }

    isCellValid(targetCell)
    {
        return targetCell && targetCell.isValid
    }
}