import {initChatMgr} from './chat/chat-manager'
import {initBasicChatCommands} from './chat/chat-basic-commands'
import {loadSettings} from './settings'
import {initPanel} from './interface/panel'
import {addBasicStyles} from './interface/css-manager'
import {initiateGameIntegrationLoaders} from './game-integration/loaders'
import {initNpcManager} from './npc/npc-manager'
import {initNightManager} from './night/night-manager'
import {initMapsManager} from './maps/maps-manager'

function start()
{
    //$('<link rel="stylesheet" href="' + nerthus.addon.fileUrl("css/style.css") + '">').appendTo('head')
    addBasicStyles()
    loadSettings()

    initiateGameIntegrationLoaders()

    initMapsManager()

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
        // We need to make sure map image is loaded, as most of
        // the Engine's functions won't work correctly without it.
        // Since we can't influence weirdly linked dependencies in
        // the game's code, we are going to use this hack, as
        // we know for certain hero.updateCollider is called once
        // after map update
        const heroUpdateCollider = Engine.hero.updateCollider
        Engine.hero.updateCollider = function ()
        {
            heroUpdateCollider.call(Engine.hero)
            // Make sure map image has been loaded, as something else can
            // execute this function otherwise.
            if (Engine.map.imgLoaded)
            {
                // We only want to start once, so after starting
                // this hook is no longer needed. That's why we
                // change it back to default.
                Engine.hero.updateCollider = heroUpdateCollider

                start()
            }
        }
    }
}
else
{
    g.loadQueue.push({'fun': start})
}