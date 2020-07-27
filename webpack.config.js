const webpack = require('webpack')
const path = require('path')
const childProcess = require('child_process')

const npcMapList = childProcess.execSync('ls res/configs/npcs').toString().match(/(\d*)*\.json/g)
const lightMapList = childProcess.execSync('ls res/configs/night-lights').toString().match(/(\d*)*\.json/g)

const availableMapFiles = {
    npc: npcMapList.map(item => parseInt(item)),
    lights: lightMapList.map(item => parseInt(item))
}

const version = childProcess.execSync('cat version').toString().replace('\n', '')

const CONSTANTS = new webpack.DefinePlugin({
    FILE_PREFIX: JSON.stringify('https://cdn.jsdelivr.net/gh/nerthus-margonem/nerthusaddon@' + version + '/'),
    AVAILABLE_MAP_FILES: JSON.stringify(availableMapFiles),
    VERSION: JSON.stringify(version)
})

module.exports = [
    {
        name: 'NI-development',
        mode: 'production',
        entry: './src/main.js',
        output: {
            path: path.resolve(__dirname, 'dist/'),
            filename: 'nerthus-addon-NI.js'
        },
        plugins: [
            CONSTANTS,
            new webpack.DefinePlugin({INTERFACE: JSON.stringify('NI')})
        ],
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: ['@babel/plugin-transform-runtime']
                        }
                    }
                }
            ]
        }
    },
    {
        name: 'SI-development',
        mode: 'production',
        entry: './src/main.js',
        output: {
            path: path.resolve(__dirname, 'dist/'),
            filename: 'nerthus-addon-SI.js'
        },
        plugins: [
            CONSTANTS,
            new webpack.DefinePlugin({INTERFACE: JSON.stringify('SI')})
        ],
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: ['@babel/plugin-transform-runtime']
                        }
                    }
                }
            ]
        }
    }
]
