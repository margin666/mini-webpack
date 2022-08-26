import {AsyncSeriesHook} from 'tapable'
import {Compilation} from './compilation.js'

export class Compiler{
    constructor(config, _callback){
        this.plugins = config.plugins
        this.entry = config.entry
        this.module = config.module
        this.hooks = {
            beforeRun: new AsyncSeriesHook(['compiler'])
        }

        this.mountPlugins()
        this._callback = _callback
    }
    mountPlugins(){
        for(const plugin of this.plugins){
            if('apply' in plugin && typeof plugin.apply === 'function'){
                plugin.apply(this)
            }
        }
    }
    run(){
        this.hooks.beforeRun.callAsync(this, this._callback)
        const comp = new Compilation(this)
        comp.make()
    }
}