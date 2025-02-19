export const settings = {
    night: true,
    weather: true,
    weatherEffects: true,
    zodiac: true,
    hideNpcs: false,
    drunkenness: true,
    /**
     * This setting hides commercials that are visible on the game's chat.
     * It can't be turned on by default due to some "commercials" being
     * actually useful information like an incoming maintenance break.
     * Hiding such information might lead to disruptions in the regular game.
     * (For example,
     * trying to fight a hard mob right before a maintenance break
     * could lead to a player being kicked out in the middle of the fight.)
     */
    hideChatCommercials: false
}

export function saveSetting(name, value)
{
    settings[name] = value
    localStorage.nerthus_options = JSON.stringify(settings)
}


export function loadSettings()
{
    if (localStorage.nerthus_options)
    {
        const loadedSettings = JSON.parse(localStorage.nerthus_options)
        for (const opt in loadedSettings)
            settings[opt] = loadedSettings[opt]
    }
    return settings
}
