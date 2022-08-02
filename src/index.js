import {Compiler} from './compiler.js'

function webpack(config, callback){
    // ----参数校验----
    const compiler = new Compiler(config)
    compiler.run() // 开始编译
}