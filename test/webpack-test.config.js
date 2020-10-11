const webpack = require('webpack')
const path = require('path')

const nodeExternals = require('webpack-node-externals')
//const commitHash = childProcess.execSync('git rev-parse --short HEAD').toString()

const availableMapFiles = {}

//const npcMapList = childProcess.execSync('ls res/configs/npcs').toString().match(/(\d*)*\.json/g)
//availableMapFiles.npc = npcMapList.map(item => parseInt(item))

//const lightMapList = childProcess.execSync('ls res/configs/night-lights').toString().match(/(\d*)*\.json/g)
//availableMapFiles.lights = lightMapList.map(item => parseInt(item))

const SI = new webpack.DefinePlugin({
    INTERFACE: JSON.stringify('SI'),
    FILE_PREFIX: JSON.stringify('http://localhost/nerthusaddon/'),
    //FILE_PREFIX: JSON.stringify('http://cdn.jsdelivr.net/gh/akrzyz/nerthusaddon' + commitHash + '/'),
    AVAILABLE_MAP_FILES: JSON.stringify(availableMapFiles)
    //OTHER: JSON.stringify(commitHash)
})

module.exports = {
    target: 'node', // webpack should emit node.js compatible code
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder from bundling
    plugins: [SI],
    mode: 'development',
    output: {
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
        devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        'presets': ['@babel/preset-env'],
                        'plugins': ['@babel/plugin-transform-modules-commonjs']
                    }
                }
            }
        ]
    },
    devtool: 'source-map'
}
