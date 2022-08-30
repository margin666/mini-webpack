
import type { Config, Plugin } from './types/config'
import { AsyncSeriesHook } from 'tapable'
import { Compilation } from './Compilation'
import {dirname, resolve} from 'path'
import {writeFile} from 'fs'



export class Compiler {
    props: Config;
    entry: string;
    hooks: any;
    callback: Function;
    plugins: Plugin[];
    module:any;
    root:string;
    moduleResult:Map<string, string>
    constructor(props: Config, callback:Function) {
        this.hooks={
            beforeRun: new AsyncSeriesHook(['compiler'])
        }
        this.entry = props.entry
        this.callback = callback
        this.plugins = props.plugins
        this.module = props.module
        this.root = props.root || dirname(this.entry)
        
    }
    mountPlugin(){
        for(const plugin of this.plugins){
            if('apply' in plugin && typeof plugin.apply === 'function'){
                plugin.apply(this)
            }
        }
    }
    run() {
        this.hooks.beforeRun.callAsync(this, this.callback)
        const com = new Compilation(this)
        com.make()
        this.moduleResult = com.sourceMap
        // setTimeout(() => {
        //     this.emit()
        // }, 1000)
    }
    emit(){
        let n = 0
        for(let item of this.moduleResult){
            n++
            
            writeFile(resolve(__dirname, `${n}.js`), item[1], {encoding:"utf8"}, function(err){
                if(err){
                    throw err
                }
                console.log('success')
            })
        }
    }
    
}