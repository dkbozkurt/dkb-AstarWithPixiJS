import GameBase from "../GameBase.js"
import GridSystem from "./GridSystem.js"
import Crab from "./Crab.js"
import Cell from "./Cell.js"
import InputController from "./InputController.js"
import Player from "./Player.js"
import Obstacle from "./Obstacle.js"

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
            // this.crab.update()
        }
    }
}