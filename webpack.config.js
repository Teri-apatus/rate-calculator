const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

module.exports = {
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'index.[contenthash].js',
        assetModuleFilename: path.join(
            'images',
            '[name].[contenthash][ext]'
        ),
        clean: true,
    },
    entry: path.join(__dirname, 'src', 'index.ts'),
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            // {
            //     test: /\.svg$/,
            //     type: 'asset/resource',
            //     generator: {
            //         filename: path.join(
            //             'icons',
            //             '[name].[contenthash][ext]'
            //         ),
            //     },
            // },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'template.html'),
            filename: 'index.html',
        }),
        new FileManagerPlugin({
            events: {
                // onStart: {
                //     delete: ['dist'],
                // },
                onEnd: {
                    copy: [
                        {
                            source: path.join('src', 'static'),
                            destination: 'dist',
                        },
                    ],
                },
            },
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],

    devServer: {
        watchFiles: path.join(__dirname, 'src'),
        open: true,
        hot: true,
        port: 9000,
    },
};
