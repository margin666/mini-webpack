const {AsyncSeriesHook} = require('tapable')
export class Compiler{
    constructor(config){
        const {entry, output, module, plugins} = config
        this.entry = entry
        this.distPath = output.path
        this.distName = output.filename
        this.loaders = module.rules
        this.plugins = plugins
        this.root = process.cwd()
        this.compilation = {}
        

        //  hooks
        this.hooks = {
            beforeRun: new AsyncSeriesHook(['compiler']),
            afterRun: new AsyncSeriesHook(['compiler']),
            beforeCompiler: new AsyncSeriesHook(['compiler']),
            afterCompiler: new AsyncSeriesHook(['compiler']),
            emit: new AsyncSeriesHook(['compiler']),
            failed: new AsyncSeriesHook(['compiler']),
        }

        this.mountPlugin()
    }

    // 注册plugin
    mountPlugin(){
        for(let plugin of this.plugins){
            if('apply' in plugin && typeof plugin.apply === 'function'){
                plugin.apply(this)
            }
        }
    }
    run(){
        // 在run之前，触发对应的生命周期事件
        this.hooks.beforeRun.callAsync(this)
    }
}