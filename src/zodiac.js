import {addWidget} from './widgets'
import {default as zodiacDescriptions} from '../res/descriptions/zodiac.json'
import {settings} from './settings'

/**
 * Zodiac sign dates in format: month: [name, end day]
 */
const ZODIAC_SIGN_START_DAY = [
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
    if (month === 11 && day < ZODIAC_SIGN_START_DAY[0][1])
        return ZODIAC_SIGN_START_DAY[0][0]
    else
        return (day > ZODIAC_SIGN_START_DAY[month][1])
            ? ZODIAC_SIGN_START_DAY[month + 1][0]
            : ZODIAC_SIGN_START_DAY[month][0]
}

export function initZodiac()
{
    if (settings.zodiac)
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
    }
}
