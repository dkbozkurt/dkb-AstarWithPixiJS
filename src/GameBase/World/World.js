import GameBase from "../GameBase.js"
import GridSystem from "./GridSystem.js"

export default class World {
    constructor() {
        this.gameBase = new GameBase()

        this.scene = this.gameBase.scene
        this.resources = this.gameBase.resources
        this.gridSystem = this.gameBase.gridSystem

        // Wait for resources
        this.resources.on('ready', () => {

            // Setup
            this.gridSystem = new GridSystem()
        })
    }

    update() {

        if(this.gridSystem)
        {
            this.gridSystem.update()
        }
    }

    destroy()
    {
        if(this.gridSystem)
        {
            this.gridSystem.destroy()
        }
    }
}