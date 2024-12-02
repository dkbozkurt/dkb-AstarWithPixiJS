import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'

import EventEmitter from './EventEmitter.js'

export default class Resources extends EventEmitter
{
    constructor(sources,loadingWindow)
    {
        super()

        // Options
        this.sources = sources
        // this.loadingWindow = loadingWindow

        // Setup
        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.startLoading()
    }

    async startLoading()
    {
        for(const source of this.sources)
        {
            if(source.type === 'texture')
            {
                let file = await PIXI.Assets.load(source.path)

                this.sourceLoaded(source, file)
            }
            else if(source.type === 'audio')
            {
                const file = new Audio(source.path)
                this.sourceLoaded(source,file)
            }
            else if(source.type === 'xmlFont')
            {
                let file = await PIXI.Assets.load(source.path)

                this.sourceLoaded(source, file)
            }
            else if(source.type === 'font')
            {
                let file = await PIXI.Assets.load(source.path)

                this.sourceLoaded(source, file)
            }
        }
    }

    sourceLoaded(source,file)
    {
        this.items[source.name] = file
        this.loaded++

        if(this.loaded === this.toLoad)
        {
            console.log('Loading finished')
            this.trigger('ready')
        }
    }

}