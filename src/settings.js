export const settings = {'night': true, 'weather': true, 'zodiac': true, 'hideNpcs': false}

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
            if (loadedSettings.hasOwnProperty(opt))
                settings[opt] = loadedSettings[opt]
    }
    saveSetting(settings)
    return settings
}
