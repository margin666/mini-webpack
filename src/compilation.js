import fs from 'fs'
import path from 'path'
export class Compilation {
    constructor(props) {
        this.entry = props.entry
        this.module = props.module
        this.root = process.cwd()
        this.moduleMap = new Map()
    }


    async make() {
        this.moduleWalker(this.entry)
    }
    moduleWalker(entry) {
        if (this.moduleMap.has(entry)) return
        const sourcePath = path.resolve(this.root, entry)
        const ctx = this.loadPares(sourcePath)
        console.log(ctx)

    }

    loadPares(entry) {
        let content = fs.readFileSync(entry, { encoding: 'utf-8' })
        const module = this.module
        
        for (let loader of module.rules) {
            const { test: reg, use } = loader
            if (reg.test(entry)) {
                // 满足条件
                if (Array.isArray(use)) {
                    while (use.length) {
                        const cur = use.pop()
                        const curLoader = typeof cur.loader === 'string'
                            ? require(cur.loader)
                            : typeof cur.loader === 'function'
                                ? cur.loader
                                : _ => _
                        content = curLoader(content)
                    }
                } else if (typeof use === 'string') {
                    const curLoader = require(use)
                    console.log(content)
                    content = curLoader(content)
                } else if (typeof use === 'function') {
                    const curLoader = use
                    content = curLoader(content)
                }


            }
        }
        return content
    }

    parse() {

    }
}