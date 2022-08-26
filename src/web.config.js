export default {
    entry: './index.js',
    plugins: [],
    module: {
        rules: [
            {
                test: /\.json$/,
                use: 'json-loader'
            },
            {
                test: /\.js$/,
                use: './test'
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-loader'
                    },
                    {
                        loader: function(){}
                    }
                ]
            }
        ]
    }
}