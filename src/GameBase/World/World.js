import GameBase from "../GameBase.js"
import Player from "./Player.js"
import GridSystem from "./GridSystem.js"
import Target from "./Target.js"

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
            this.player = new Player(this.gridSystem.allCells[0])
            this.target = new Target(this.gridSystem.allCells[this.gridSystem.allCells.length - 1])
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

        if(this.inputController)
        {
            this.inputController.update()
        }
    }
}