import {Compiler} from './compiler.js'

export function webpack(config, callback = () => {}){
    
    const compiler = new Compiler(config, callback)
    

    compiler.run()
}