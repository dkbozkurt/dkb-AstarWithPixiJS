// import Sizes from './Utils/Sizes.js'
// import Time from './Utils/Time.js'
import Scene from './Scene.js';
// import Resources from './Utils/Resources.js';
// import sources from './sources.js'
// import World from './World/World.js';
let instance = null;

export default class GameBase
{
    constructor(canvas)
    {
        // Singleton pattern
        if(instance)
        {
            return instance
        }
        instance = this;

        window.gameBase = this

        // Options
        this.canvas = canvas

        // Setup
        // this.sizes = new Sizes()
        // this.time = new Time()
        this.scene = new Scene()
        // this.resources = new Resources(sources)
        // this.world = new World()

        // this.sizes.on('resize',()=>
        // {
        //     this.resize()
        // })

        // this.time.on('tick', () =>
        // {
        //     this.update()
        // })
    }

    resize()
    {
        this.scene.resize()
    }

    update()
    {
        // this.world.update()
    }
}