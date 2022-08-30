const {resolve} = require('path')
module.exports = {
    entry: resolve(__dirname, 'src', 'index.js'),
    module: {
        rules: [
            {
                test: /\.js$/,
                use: function (ctx: string) {
                    return `
                        console.log('loader');
                        ${ctx}
                    `
                }
            },
        ]
    }
}