import js from '@eslint/js'
import globals from 'globals'

const gameGlobals = {
    NI: {
        Engine: 'readonly',
        API: 'readonly'
    },
    SI: {
        g: 'readonly',
        hero: 'readonly',
        map: 'readonly',
        addScrollbar: 'readonly',
        removeScrollbar: 'readonly'
    },
    common: {
        _g: 'readonly',
        _t: 'readonly',
        message: 'readonly',
        log: 'readonly',
        warn: 'readonly',
        error: 'readonly',
        CFG: 'readonly'
    }
}

const buildGlobals = {
    INTERFACE: 'readonly',
    CURRENT_MAP_ID: 'readonly',
    FILE_PREFIX: 'readonly',
    AVAILABLE_MAP_FILES: 'readonly',
    // userscript globals
    NI_VERSION_URL: 'readonly',
    SI_VERSION_URL: 'readonly',
    VERSION: 'readonly'
}


export default [
    js.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.jquery,
                ...gameGlobals.SI,
                ...gameGlobals.NI,
                ...gameGlobals.common,
                ...buildGlobals
            }
        },
        rules: {
            indent: ['error', 4, {'SwitchCase': 1}],
            'linebreak-style': ['error', 'unix'],
            quotes: ['error', 'single'],
            semi: ['error', 'never']
        }
    }
]
