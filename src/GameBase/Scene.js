import * as PIXI from 'pixi.js'
import GameBase from './GameBase.js'

export default class Scene{

    constructor()
    {
        this.gameBase = new GameBase()
        this.sizes = this.gameBase.sizes

        this.setupScene()
        this.enableInteractivity()
    }

    setupScene()
    {
        this.app = new PIXI.Application()

        this.app.init({
            canvas: this.gameBase.canvas,
            resizeTo: window,
            antialias: true,
            autoResize: true,
            backgroundColor: 0xd3d3d3,
        })

        this.stage = this.app.stage
    }

    resize()
    {
        this.app.resize(this.sizes.width, this.sizes.height,this.sizes.pixelRation);
    }

    add(item)
    {
        this.stage.addChild(item)
    }

    enableInteractivity()
    {
        this.stage.eventMode = 'static'
        this.stage.interactive = true;
    }
}