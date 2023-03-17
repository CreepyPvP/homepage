const path = require('path');
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: './src/index.ts',
    mode: 'development',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
    },
    resolve: {
        // the last `...` is optional in case you want
        // to keep the default webpack extension resolution
        extensions: [".ts", "", "..."]
    },
    module:{
        rules:[
            {
                loader: 'babel-loader',
                test: /\.ts?$/,
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            }

        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: "src/index.html"
        })
    ]
};
