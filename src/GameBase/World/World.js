import GameBase from "../GameBase.js"
import Crab from "./Crab.js"

export default class World {
    constructor() {
        this.gameBase = new GameBase()

        this.scene = this.gameBase.scene
        this.resources = this.gameBase.resources

        // Wait for resources
        this.resources.on('ready', () => {

            // Setup
            this.crab = new Crab()
        })
    }

    update() {
        if(this.crab)
        {
            this.crab.update()
        }
    }
}