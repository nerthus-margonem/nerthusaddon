import * as childProcess from 'child_process'
import yaml from 'js-yaml'
import * as path from 'path'
import {dirname} from 'path'
import {fileURLToPath} from 'url'
import webpack from 'webpack'
import fs from 'node:fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

const npc = fs.readdirSync('res/configs/npcs')
    .filter(filename => filename.endsWith('.json'))
    .map(filename => filename.substring(0, filename.length - 5))
    .map(filename => parseInt(filename))
const lights = fs.readdirSync('res/configs/night-lights')
    .filter(filename => filename.endsWith('.json'))
    .map(filename => filename.substring(0, filename.length - 5))
    .map(filename => parseInt(filename))

const version = childProcess.execSync('cat version').toString().replace('\n', '')

const CONSTANTS = new webpack.DefinePlugin({
    FILE_PREFIX: JSON.stringify('https://cdn.jsdelivr.net/gh/nerthus-margonem/nerthusaddon@' + version + '/'),
    AVAILABLE_MAP_FILES: JSON.stringify({npc, lights}),
    VERSION: JSON.stringify(version)
})
export default [
    {
        name: 'NI-production',
        mode: 'production',
        entry: './src/main.js',
        output: {
            path: path.resolve(__dirname, 'dist/'),
            filename: 'nerthus-addon-NI.js'
        },
        plugins: [
            CONSTANTS,
            new webpack.DefinePlugin({
                INTERFACE: JSON.stringify('NI'),
                CURRENT_MAP_ID: 'Engine.map.d.id'
            })
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
                },
                {
                    test: /\.yaml$/i,
                    type: 'json',
                    parser: {
                        parse: yaml.load
                    }
                }
            ]
        }
    },
    {
        name: 'SI-production',
        mode: 'production',
        entry: './src/main.js',
        output: {
            path: path.resolve(__dirname, 'dist/'),
            filename: 'nerthus-addon-SI.js'
        },
        plugins: [
            CONSTANTS,
            new webpack.DefinePlugin({
                INTERFACE: JSON.stringify('SI'),
                CURRENT_MAP_ID: 'map.id'
            })
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
                },
                {
                    test: /\.yaml$/i,
                    type: 'json',
                    parser: {
                        parse: yaml.load
                    }
                }
            ]
        }
    }
]
