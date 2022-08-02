const {dirname} = require('path')
class Compilation{
    constructor(compiler){
        const {
            entry,
            root,
            loaders,
            hooks
        } = compiler

        this.enter = entry
        this.root = root
        this.loaders = loaders
        this.hooks = hooks
        this.moduleMap = new Map()
    }
    // 开始编译
    async make(){
        await this.moduleWalker(this.entry)
    }
    // dfs遍历
    // 编译主要是用对应的loader处理对应的文件，返回源码
    // 将所有的require改成__webpack_require__函数，所有被编译后的都存在了moduleMap的闭包中
    // 只能通过__webpack_require__函数来进行访问
    // 完成编译之后，收集引用并返回compilation，递归编译，收集是为了防止循环引用
    async moduleWalker(sourcePath) {
        if(this.moduleMap.has(sourcePath))return

        // 获取完整的以.js结尾的路径
        sourcePath = completeFilePath(sourcePath)
        const [sourceCode, md5Hash] = await this.loaderParse(sourcePath)
        const modulePath = getRootPath(this.root, sourcePath, this.root)


        // 获取编译后的依赖数组
        const [moduleCode, relyInModule] = this.parse(sourceCode, dirname(modulePath)) 

        // 存放map
        this.moduleMap.set(modulePath, module)

        // 递归解析
        for(const mo of relyInModule){
            await this.moduleWalker(mo, dirname(mo))
        }
    }

    loaderParse(sourcePath){
        // 读取文件内容
        
    }
}
