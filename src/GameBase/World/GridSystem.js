import * as PIXI from 'pixi.js'
import GameBase from '../GameBase.js'

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
        this.initialXOffSet = 25
        this.initialYOffSet = 25
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

            const newCell = new PIXI.Sprite(this.resources.items["cellTexture"])
            newCell.scale.set(0.5, 0.5)
            newCell.x = this.initialXOffSet + this.gridIncrementValue * counter
            newCell.y = this.initialYOffSet + ySpacing

            newCell.Id = i
            this.allCells.push(newCell)
            this.scene.add(newCell)

            counter += 1

            if (counter >= this.cellsPerRow) {
                counter = 0
                ySpacing += this.gridIncrementValue
            }
        }
    }
}