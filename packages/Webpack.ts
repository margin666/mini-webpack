import type {Config} from './types/config'
import {Compiler} from './Compiler'
export default function(config:Config, callback:Function = _ => _){
    const compiler = new Compiler(config, callback)
    compiler.run()
}