const loadQueue = []

export function loadOnEveryMap(fun, data)
{
    loadQueue.push([fun, data])
}

function loadNewMapQueue()
{
    for (const i in this.loadQueue)
    {
        loadQueue[i][0](loadQueue[i][1])
    }
}


export function initiateGameIntegrationLoaders()
{
    if (INTERFACE === 'NI')
    {

    }
    else
    {
        // Observe map change if user have some kind of fast map switcher (e.g. 'Szybsze przechodzenie' by Adi Wilk)
        window.map.__loaded = window.map.loaded
        Object.defineProperty(window.map, 'loaded', {
            set(val)
            {
                this.__loaded = val
                loadNewMapQueue()

                return val
            },
            get() { return this.__loaded }
        })
    }
}
