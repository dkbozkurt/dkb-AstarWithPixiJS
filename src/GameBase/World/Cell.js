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

        this.setCellColor(this.colors.valid)

        this.isOnOpenList = false
        this.isOnClosedList = false

        this.fScore = 0
        this.gScore = 0
        this.hScore = 0

        this.setup(x, y)
    }

    setup(xCoord, yCoord) {

        this.cellModel.x = xCoord
        this.cellModel.y = yCoord

        this.scene.add(this.cellModel)
    }

    reset()
    {
        this.fScore = 0
        this.gScore = 0
        this.hScore = 0

        this.isOnOpenList = false
        this.isOnClosedList = false

        this.setCellColor(this.isValid ? this.colors.valid : this.colors.inValid)
    }

    setValidity(status)
    {
        this.isValid = status
        this.setCellColor(this.isValid ? this.colors.valid : this.colors.inValid)
    }

    setAsStart()
    {
        this.gridSystem.resetCell(this.gridSystem.startCell)
        this.gridSystem.startCell = this
        this.setCellColor(this.colors.start)
    }

    setAsTarget()
    {
        this.gridSystem.resetCell(this.gridSystem.endCell)
        this.gridSystem.endCell = this
        this.setCellColor(this.colors.target)
    }

    setToClosedList()
    {
        this.isOnClosedList = true
        this.isOnOpenList = false
        this.setCellColor(this.colors.onClosedList)
    }

    setToOpenList()
    {
        this.isOnOpenList = true
        this.setCellColor(this.colors.onOpenList)
    }

    setCellColor(targetColor)
    {
        this.currentColor = targetColor
        this.cellModel.tint = targetColor
    }

    update() { }

    destroy() { }
}