
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        simple: ['webpack/hot/dev-server', './examples/simple/app.js']
    },
    output: {
        path: './dist',
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js(x?)$/,
            exclude: /node_modules/,
            loader: 'babel-loader?experimental&optional=runtime'
        }, {
            test: /\.css$/,
            exclude: /node_modules/,
            loader: 'style-loader!css-loader'
        }]
    },
    plugins: [new HtmlWebpackPlugin({
        title: 're-structure examples'
    })]
};