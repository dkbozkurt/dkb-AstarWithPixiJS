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

        this.Id = -1
        this.isValid = true

        this.blockedCells = []

        this.colors = {}
        this.colors.valid = 0x9290FF
        this.colors.inValid = 0xFF000D
        this.colors.start = 0xFFFFFF
        this.colors.target = 0x000000
        this.colors.onClosedList = 0x2513FF
        this.colors.onOpenList = 0xB8B2FF

        this.currentColor = this.colors.valid

        this.isOnOpenList = false
        this.isOnClosedList = false

        this.fScore = 0
        this.gScore = 0
        this.hScore = 0

        this.setup(x, y)
    }

    setup(xCoord, yCoord) {
        this.cellModel = new PIXI.Sprite(this.resources.items["cellTexture"])
        this.cellModel.scale.set(0.5, 0.5)

        this.cellModel.x = xCoord
        this.cellModel.y = yCoord

        this.scene.add(this.cellModel)
    }

    update() { }

    destroy() { }
}