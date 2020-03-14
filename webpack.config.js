const webpack = require('webpack')
const path = require('path')

//const version = require('version.json')
//console.log(version)

const childProcess = require('child_process')

const commitHash = childProcess.execSync('git rev-parse --short HEAD').toString()

const availableMapFiles = {}

const npcMapList = childProcess.execSync('ls npcs').toString().match(/(\d*)*\.json/g)
availableMapFiles.npc = npcMapList.map(item => parseInt(item));

const lightMapList = childProcess.execSync('ls night-lights').toString().match(/(\d*)*\.json/g)
availableMapFiles.lights = lightMapList.map(item => parseInt(item));

const SI = new webpack.DefinePlugin({
    INTERFACE: JSON.stringify('SI'),
    FILE_PREFIX: JSON.stringify('http://localhost/nerthusaddon/'),
    //FILE_PREFIX: JSON.stringify('http://cdn.jsdelivr.net/gh/akrzyz/nerthusaddon' + commitHash + '/'),
    AVAILABLE_MAP_FILES: JSON.stringify(availableMapFiles),
    OTHER: JSON.stringify(commitHash)
})

const NI = new webpack.DefinePlugin({
    INTERFACE: JSON.stringify('NI'),
    FILE_PREFIX: JSON.stringify('http://localhost/nerthusaddon/'),
    AVAILABLE_MAP_FILES: JSON.stringify(availableMapFiles)
    //FILE_PREFIX: JSON.stringify('http://cdn.jsdelivr.net/gh/akrzyz/nerthusaddon' + commitHash + '/'),
})

module.exports = [
    {
        name: 'NI_production',
        mode: 'development',
        entry: './src/main.js',
        output: {
            path: path.resolve(__dirname, 'dist/'),
            filename: 'nerthus-addon-NI.js'
        },
        plugins: [NI]
    },
    {
        name: 'SI_production',
        mode: 'development',
        entry: './src/main.js',
        output: {
            path: path.resolve(__dirname, 'dist/'),
            filename: 'nerthus-addon-SI.js'
        },
        plugins: [SI]
    }
]
