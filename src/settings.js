export const settings = {
    night: true,
    weather: true,
    weatherEffects: true,
    zodiac: true,
    hideNpcs: false,
    drunkenness: true,
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
