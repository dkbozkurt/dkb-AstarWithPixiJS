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
        this.currentPathIndex = 0

        this.setModel(initialStartCell)

        this.gridSystem.on('onPathGenerated', (path) => {
            this.move(path)
        })
    }

    setModel(initialStartCell) {
        this.crabModel = new PIXI.Sprite(this.resources.items["crabTexture"])

        this.crabModel.scale.set(0.4, 0.4)
        this.crabModel.zIndex = 2

        // Set anchor point to the center for proper rotation
        this.crabModel.anchor.set(0.5);

        this.setModelPositionToCell(initialStartCell)

        // Add the bunny to the stage
        this.gameBase.scene.add(this.crabModel)
    }

    setModelPositionToCell(cell) {
        // Set the bunny's position to the center of the canvas
        this.crabModel.x = cell.cellModel.x
        this.crabModel.y = cell.cellModel.y
    }


    update() {

    }

    async move(cells) {
        this.currentPathIndex = 0
        for (let i = 0; i < cells.length; i++) {

            const nextCell = cells[this.currentPathIndex];
            this.crabModel.x = nextCell.cellModel.x;
            this.crabModel.y = nextCell.cellModel.y;
            this.currentPathIndex++;

            await this.wait(50);
        }

        this.gridSystem.target.hamburgerModel.visible = false
        console.log('Done!');
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Function to wait for one frame
    waitForNextFrame() {
        return new Promise(resolve => requestAnimationFrame(resolve));
    }

    destroy() {

    }
}