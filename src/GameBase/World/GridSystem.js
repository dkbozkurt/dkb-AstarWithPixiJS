import * as PIXI from 'pixi.js'
import GameBase from '../GameBase.js'

export default class GridSystem {
    constructor() {
        this.gameBase = new GameBase()
        this.sizes = this.gameBase.sizes
        this.resources = this.gameBase.resources
        this.scene = this.gameBase.scene

        this.setup()
    }

    setup() {
    
    }

    update() {}

    destroy() {}
}