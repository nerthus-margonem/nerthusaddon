import {addWidget} from './widgets'
import {default as zodiacDescriptions} from '../res/descriptions/zodiac.json'
import {settings} from './settings'

/**
 * Offset of sign icon in image
 */
const SIGN_IMAGE_OFFSET = {
    'Aquarius': 0,
    'Pisces': -55,
    'Aries': -110,
    'Taurus': -165,
    'Gemini': -220,
    'Cancer': -275,
    'Leo': -330,
    'Virgo': -385,
    'Libra': -440,
    'Scorpio': -495,
    'Sagittarius': -550,
    'Capricorn': -605
}

/**
 * Zodiac sign dates in format: month: [name, end day]
 */
const ZODIAC_SIGN_START_DAY = [
    ['Capricorn', 19],
    ['Aquarius', 18],
    ['Pisces', 20],
    ['Aries', 19],
    ['Taurus', 22],
    ['Gemini', 21],
    ['Cancer', 22],
    ['Leo', 23],
    ['Virgo', 22],
    ['Libra', 22],
    ['Scorpio', 21],
    ['Sagittarius', 21],
    ['Capricorn', 0] // repeat Capricorn for the end of the year
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
            'Znak zodiaku',
            FILE_PREFIX + 'res/img/zodiac-icons.gif',
            zodiacDescriptions[currentSign][0]
        )
        $widget.children('.nerthus__widget-image')
            .css({
                cursor: 'pointer',
                backgroundPositionY: SIGN_IMAGE_OFFSET[currentSign] + 'px'
            })
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
