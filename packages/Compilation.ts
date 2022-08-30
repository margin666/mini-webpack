import type { Config } from './types/config'
import { dirname, resolve } from 'path'
import { readFileSync, createReadStream, writeFile } from 'fs'
import { parse } from '@babel/parser'
import { createHash } from 'crypto'
const traverse = require('@babel/traverse').default
import { stringLiteral } from '@babel/types'
import generator from '@babel/generator'
export class Compilation {
    props: Config;
    sourceMap: Map<string, string>
    constructor(props: Config) {
        this.props = props
        this.sourceMap = new Map()
    }
    async make() {
        const url = resolve(this.props.root, this.props.entry)
        await this.moduleWalker(url)
        
    }
    
    async moduleWalker(sourcePath: string) {
        if(this.sourceMap.has(sourcePath))return
        const newsourcePath = sourcePath.replace(/(?<!\.js)$/, '.js')
        const new2path = resolve(this.props.root, newsourcePath)
        const {content, HashCode} = await this.parseLoader(new2path)
        const {code, relyInModule} = this.parse(content, sourcePath)
        this.sourceMap.set(sourcePath, code)
        
        for(const rpath of relyInModule){
            await this.moduleWalker(rpath)
        }
        
    }

    async parseLoader(sourcePath: string) {
        
        // sourcePath = resolve(dirname(sourcePath), sourcePath)
        
        let [content, HashCode] = await this.readFileWithHash(sourcePath)
        for (const loader of this.props.module.rules) {
            const { use, test: reg } = loader
            if (reg.test(sourcePath)) {
                if (Array.isArray(use)) {

                } else if (typeof use === 'string') {

                } else if (typeof use === 'function') {
                    const currentLoader = use
                    content = currentLoader(content)
                }
            }
        }
        return { content, HashCode}
    }
    parse(content: string, rootPath: string) {
        const ast = parse(content, {
            sourceType: 'module'
        })
        const that = this
        let relyInModule = []
        traverse(ast, {
            CallExpression(p) {
                if (p.node.callee && p.node.callee.name === '') {
                    that.changeNode(p.node, rootPath, relyInModule)
                } else if (p.node.callee.name === 'require') {

                    that.changeNode(p.node, rootPath, relyInModule)
                }
            }
        })
        const code = generator(ast).code
        return {
            code, relyInModule
        }


    }
    changeNode(node: any, rootPath: string, relyInModule: any[]) {
        node.callee.name = '__webpack_require__'
        const moduleKey = node.arguments[0].value
        const modulePath = resolve(dirname(rootPath), moduleKey)
        relyInModule.push(modulePath)
        node.arguments = [stringLiteral(modulePath)]
    }
    readFileWithHash(path: string) {
        return new Promise<[string, string]>((resolve, reject) => {
            try {
                const content = readFileSync(path, 'utf8')
                const hash = createHash('sha1')
                let s = createReadStream(path)
                s.on('data', (d) => {
                    hash.update(d)
                })
                s.on('end', () => {
                    const HashCode = hash.digest('hex')
                    resolve([
                        content,
                        HashCode
                    ])
                })
            } catch (error) {
                reject('读取文件出错！')
            }
        })


    }
}