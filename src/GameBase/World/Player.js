import * as PIXI from 'pixi.js'
import GameBase from '../GameBase.js'

export default class Player {

    constructor() {
        this.gameBase = new GameBase()
        this.sizes = this.gameBase.sizes
        this.resources = this.gameBase.resources
        this.scene = this.gameBase.scene

        this.setModel()
    }

    setModel() {
        this.crabModel = new PIXI.Sprite(this.resources.items["crabTexture"])

        this.crabModel.scale.set(0.5,0.5)

        // Set the bunny's position to the center of the canvas
        this.crabModel.x = this.sizes.width / 2
        this.crabModel.y = this.sizes.height / 2

        // Set anchor point to the center for proper rotation
        this.crabModel.anchor.set(0.5);

        // Add the bunny to the stage
        this.gameBase.scene.add(this.crabModel)
    }


    update() {
        if (this.crabModel) {
            // this.crabModel.rotation += 0.1;
        }
    }
}