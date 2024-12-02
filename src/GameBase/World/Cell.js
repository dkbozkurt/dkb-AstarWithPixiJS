import * as PIXI from 'pixi.js'
import GameBase from '../GameBase.js'

export default class Cell {

    constructor(x,y) {
        this.gameBase = new GameBase()
        this.sizes = this.gameBase.sizes
        this.resources = this.gameBase.resources
        this.scene = this.gameBase.scene

        this.Id = -1

        this.setup(x,y)
    }

    setup(xCoord,yCoord) {
        this.cellModel = new PIXI.Sprite(this.resources.items["cellTexture"])
        this.cellModel.scale.set(0.5, 0.5)

        this.cellModel.x = xCoord
        this.cellModel.y = yCoord

        this.scene.add(this.cellModel)
    }

    update() { }

    destroy() { }
}