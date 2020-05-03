const loadQueue = []

/**
 * Executes function immediately, then executes it at every new map load
 * @param fun - function that will be executed
 * @param args - arguments function will take
 */
export function loadOnEveryMap(fun, args)
{
    if (INTERFACE === 'NI' || map.id !== -1) fun(args)
    loadQueue.push([fun, args])
}

function loadNewMapQueue()
{
    for (const i in loadQueue)
    {
        loadQueue[i][0](loadQueue[i][1])
    }
}

export function initiateGameIntegrationLoaders() //TODO bug: sometimes long loading new map is loaded faster than old
{
    if (INTERFACE === 'NI')
    {
        // Load map queue when new map file is provided (Engine.map.d contains current data at that point)
        const mapUpdate = Engine.map.onUpdate.file
        Engine.map.onUpdate.file = function (new_v, old_v)
        {
            mapUpdate.call(Engine.map.onUpdate, new_v, old_v)
            loadNewMapQueue(Engine.map.d.id)
        }
    }
    else
    {
        // Handle Szybsze ładowanie gry by Priv
        const oldParseInput = window._g
        window._g = function (data)
        {
            if (data.includes('initlvl=4')) loadNewMapQueue()

            return oldParseInput.apply(this, arguments)
        }

        // Handle Szybsze przechodzenie by Adi Wilk
        window.g.chat.__parsers = window.g.chat.parsers
        Object.defineProperty(window.g.chat, 'parsers', {
            set(val)
            {
                this.__parsers = val
                if (val.length === 0) loadNewMapQueue()
                return val
            },
            get() { return this.__parsers }
        })
    }
}

export function addToNiDrawList(preparedObject, id)
{
    const npcList = Engine.npcs.check()
    npcList[id] = preparedObject
}
