import * as PIXI from 'pixi.js'
import GameBase from '../GameBase.js'
import GridSystem from './GridSystem.js'

export default class Player {

    constructor(initialStartCell) {
        this.gameBase = new GameBase()
        this.sizes = this.gameBase.sizes
        this.resources = this.gameBase.resources
        this.scene = this.gameBase.scene
        this.gridSystem = new GridSystem()

        this.setModel(initialStartCell)
    }

    setModel(initialStartCell) {
        this.crabModel = new PIXI.Sprite(this.resources.items["crabTexture"])

        this.crabModel.scale.set(0.4,0.4)

        // Set anchor point to the center for proper rotation
        this.crabModel.anchor.set(0.5);

        initialStartCell.setAsStart()

        // Set the bunny's position to the center of the canvas
        this.crabModel.x = initialStartCell.cellModel.x
        this.crabModel.y = initialStartCell.cellModel.y

        // Add the bunny to the stage
        this.gameBase.scene.add(this.crabModel)
    }


    update() {
        if (this.crabModel) {
            // this.crabModel.rotation += 0.1;
        }
    }
}