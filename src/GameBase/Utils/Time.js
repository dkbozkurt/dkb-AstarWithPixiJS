import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter
{
    constructor()
    {
        super()

        // Setup
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.elapsedInSeconds = this.elapsed * 0.0001
        this.delta = 16 // !!! Do not set to 0, because some bugs can happen
        this.deltaInSeconds = this.delta * 0.0001

        // Waiting for a single frame before calling tick so delta wont be 0 at the first frame.
        window.requestAnimationFrame(() => {
            this.tick()
        })
    }

    tick()
    {
        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.deltaInSeconds = this.delta * 0.001
        this.current = currentTime
        this.elapsed = this.current - this.start
        this.elapsedInSeconds = this.elapsed * 0.001

        this.trigger('tick')

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }
}