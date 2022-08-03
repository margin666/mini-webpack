const babel = require('@babel/core')


module.exports = function BabelLoader(source){
    const res = babel.transform(source, {
        sourceType: 'module'
    })
    return res.code
}