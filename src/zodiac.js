import {default as zodiacDescriptions} from '../res/descriptions/zodiac.json'
import {addSettingToPanel} from './interface/panel'
import {settings} from './settings'
import {addWidget} from './widgets'

/**
 * Zodiac sign dates in format: month: [name, end day]
 */
export const ZODIAC_SIGN_START_DAY = [
    ['capricorn', 19],
    ['aquarius', 18],
    ['pisces', 20],
    ['aries', 19],
    ['taurus', 22],
    ['gemini', 21],
    ['cancer', 22],
    ['leo', 23],
    ['virgo', 22],
    ['libra', 22],
    ['scorpio', 21],
    ['sagittarius', 21],
    ['capricorn', 0] // repeat Capricorn for the end of the year
]

/**
 * @param day
 * @param month - starts at 0
 * @returns string
 */
export function getZodiacSign(day, month)
{
    return (day > ZODIAC_SIGN_START_DAY[month][1])
        ? ZODIAC_SIGN_START_DAY[month + 1][0]
        : ZODIAC_SIGN_START_DAY[month][0]
}

export function initZodiac()
{
    const date = new Date()
    const currentSign = getZodiacSign(date.getUTCDate(), date.getUTCMonth())
    const $widget = addWidget(
        'zodiac',
        FILE_PREFIX + 'res/img/zodiac/' + currentSign + '.png',
        zodiacDescriptions[currentSign][0]
    )
    $widget.children('.nerthus__widget-image')
        .css('cursor', 'pointer')
        .click(function ()
        {
            const $desc = $widget.children('.nerthus__widget-desc')
            if ($desc.text() === zodiacDescriptions[currentSign][0])
                $desc.text(zodiacDescriptions[currentSign][1])
            else
                $desc.text(zodiacDescriptions[currentSign][0])
        })

    if (settings.zodiac) $widget.css('display', 'flex')
    else $widget.css('display', 'none')

    addSettingToPanel(
        'zodiac',
        'Widget znaku zodiaku',
        'Pokazuje lub ukrywa widget w lewym górnym rogu mapy.',
        function ()
        {
            if (settings.zodiac) $widget.css('display', 'flex')
            else $widget.css('display', 'none')
        })

    return $widget
}
