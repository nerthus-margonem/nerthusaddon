const loadQueue = []

export function loadOnEveryMap(fun, data)
{
    loadQueue.push([fun, data])
}

function loadNewMapQueue()
{
    for (const i in loadQueue)
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

export function onDefined(valueToBeDefined, callback) //TODO ?
{
    const valArr = valueToBeDefined.toString().split('.')
    const len = valArr.length
    let object = window
    for (let i = 0; i < len; i++)
    {
        if (typeof object[valArr[i]] === 'undefined')
            return setTimeout(onDefined.bind(this, valueToBeDefined, callback), 500)
        else
            object = object[valArr[i]]
    }
    callback()
}

export function addToNIdrawList(preparedObject, id) {
    const npcList = Engine.npcs.check()
    npcList[id] = preparedObject
}