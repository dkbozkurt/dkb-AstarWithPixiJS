import GameBase from "../GameBase.js"
import Player from "./Player.js"
import GridSystem from "./GridSystem.js"
import Cell from "./Cell.js"
import InputController from "./InputController.js"
import Obstacle from "./Obstacle.js"

export default class World {
    constructor() {
        this.gameBase = new GameBase()

        this.scene = this.gameBase.scene
        this.resources = this.gameBase.resources
        this.gridSystem = this.gameBase.gridSystem

        // Wait for resources
        this.resources.on('ready', () => {

            // Setup
            this.player = new Player()
            this.gridSystem = new GridSystem()
        })
    }

    update() {
        if(this.player)
        {
            this.player.update()
        }

        if(this.gridSystem)
        {
            this.gridSystem.update()
        }
    }
}