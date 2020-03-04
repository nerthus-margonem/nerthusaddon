import {initChatMgr} from './chat/chat-manager'
import {initBasicChatCommands} from './chat/chat-basic-commands'
import {loadSettings} from './settings'
import {initPanel} from './interface/panel'
import {addBasicStyles} from './interface/css-manager'
import {initiateGameIntegrationLoaders} from './game-integration/loaders'
import {initNpcManager} from './npc/npc-manager'
import {initNightManager} from './night/night-manager'

function start()
{
    console.log(AVAILABLE_MAP_FILES)
    console.log('File prafix: ' + FILE_PREFIX)
    console.log("map loaded SI?")
    console.log(window.map ? window.map.loaded : '')
    //$('<link rel="stylesheet" href="' + nerthus.addon.fileUrl("css/style.css") + '">').appendTo('head')
    addBasicStyles()
    loadSettings()

    initiateGameIntegrationLoaders()

    initNpcManager()

    initNightManager()

    initChatMgr()
    initBasicChatCommands()

    initPanel()
    console.log('Nerthus addon fully loaded')
}

if (INTERFACE === 'NI')
{
    if (Engine.map.d.id) start()
    else
    {
        const mapUpdate = Engine.map.onUpdate.file
        Engine.map.onUpdate.file = function (new_v, old_v)
        {
            mapUpdate.call(Engine.map.onUpdate, new_v, old_v)
            // Immediately replace the function back, because we want to use it only once
            Engine.map.onUpdate.file = mapUpdate

            start()
        }
    }
}
else
{
    g.loadQueue.push({'fun': start})
}