import * as PIXI from 'pixi.js'
import GameBase from '../GameBase.js'
import GridSystem from './GridSystem.js'

export default class InputController {
    constructor() {
        this.gameBase = new GameBase()
        this.sizes = this.gameBase.sizes
        this.resources = this.gameBase.resources
        this.scene = this.gameBase.scene
        this.gridSystem = new GridSystem()

        this.setup()
    }

    setup() {
        this.scene.stage.on('pointerdown', this.onPointerDown.bind(this))
        window.addEventListener('contextmenu', this.onContextMenu.bind(this))
    }

    onPointerDown(event) {
        const pointer = event.data.global
        // console.log('Event ',event);
        if (event.data.button === 0) {
            console.log('Left Click');
            // this.setStartCell(pointer)
        } else if (event.data.button === 2) {
            console.log('Right Click');
            // this.setTargetCell(pointer)
        }
    }

    onContextMenu(event) {
        event.preventDefault()
    }

    setStartCell(pointer) {
        
    }

    setTargetCell(pointer)
    {
        
    }

    update() {

    }

    destroy() { }
}