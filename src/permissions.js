import {default as permissions} from '../res/configs/permissions'
/*
    0: normal player
    1: narrator
    2: councilor (radny)
    100: dev or other special reason
 */
export const PERMISSION_LVL = {DEFAULT: 0, NARRATOR: 1, COUNCILOR: 2, NAMIESTNIK: 3, SPECIAL: 100}

export function checkPermissionLvl(nick)
{
    if (permissions.namiestnik.indexOf(nick) >= 0) return PERMISSION_LVL.NAMIESTNIK
    if (permissions.radny.indexOf(nick) >= 0) return PERMISSION_LVL.COUNCILOR
    if (permissions.narrator.indexOf(nick) >= 0) return PERMISSION_LVL.NARRATOR
    if (permissions.special.indexOf(nick) >= 0) return PERMISSION_LVL.SPECIAL
    return PERMISSION_LVL.DEFAULT
}

export function hasNarrationRights(nick)
{
    return checkPermissionLvl(nick) > PERMISSION_LVL.DEFAULT
}
