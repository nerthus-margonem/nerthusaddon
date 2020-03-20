const loadQueue = []

/**
 * Executes function immediately, then executes it at every new map load
 * @param fun - function that will be executed
 * @param args - arguments function will take
 */
export function loadOnEveryMap(fun, args)
{
    fun(args)
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
            //loadNewMapQueue(Engine.map.d.id)
            console.log('Load map queue')
            console.log(Engine.map.d.id)
        }
    }
    else
    {
        // Observe map change if user have some kind of fast map switcher (e.g. 'Szybsze przechodzenie' by Adi Wilk)
        let previousMapId = -1

        window.map.__loaded = window.map.loaded
        Object.defineProperty(window.map, 'loaded', {
            set(val)
            {
                console.log('New map loaded')
                this.__loaded = val
                if (previousMapId !== window.map.id)
                {
                    loadNewMapQueue(window.map.id)
                    previousMapId = window.map.id
                }
                return val
            },
            get() { return this.__loaded }
        })
    }
}

export function addToNIdrawList(preparedObject, id)
{
    const npcList = Engine.npcs.check()
    npcList[id] = preparedObject
}
