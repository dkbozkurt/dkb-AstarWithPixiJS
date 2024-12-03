import * as PIXI from 'pixi.js'
import GameBase from '../GameBase.js'
import GridSystem from './GridSystem.js'

export default class Target {
    constructor(initialTargetCell) {
        this.gameBase = new GameBase()
        this.sizes = this.gameBase.sizes
        this.resources = this.gameBase.resources
        this.scene = this.gameBase.scene
        this.gridSystem = new GridSystem()

        this.setup(initialTargetCell)
    }

    setup(initialTargetCell) {
        this.hamburgerModel = new PIXI.Sprite(this.resources.items["hamburgerTexture"])

        this.hamburgerModel.scale.set(0.4, 0.4)
        this.hamburgerModel.zIndex = 1

        // Set anchor point to the center for proper rotation
        this.hamburgerModel.anchor.set(0.5);

        this.setModelPositionToCell(initialTargetCell)
        // Add the bunny to the stage
        this.gameBase.scene.add(this.hamburgerModel)
    }

    setModelPositionToCell(cell) {
        // Set the bunny's position to the center of the canvas
        this.hamburgerModel.x = cell.cellModel.x
        this.hamburgerModel.y = cell.cellModel.y
    }

    update() { }

    destroy() { }
}