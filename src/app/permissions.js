import {default as permissions} from '../../res/configs/permissions.yaml'
/*
    0: normal player
    1: narrator
    2: councilor (radny)
    100: dev or other special reason
 */
export const PERMISSION_LVL = {DEFAULT: 0, NARRATOR: 1, COUNCILOR: 2, NAMIESTNIK: 3, SPECIAL: 100}

export function checkPermissionLvl(accountId)
{
    if (permissions.namiestnik.includes(accountId)) return PERMISSION_LVL.NAMIESTNIK
    if (permissions.radny.includes(accountId)) return PERMISSION_LVL.COUNCILOR
    if (permissions.narrator.includes(accountId)) return PERMISSION_LVL.NARRATOR
    if (permissions.special.includes(accountId)) return PERMISSION_LVL.SPECIAL
    return PERMISSION_LVL.DEFAULT
}

export function hasNarrationRights(accountId)
{
    return checkPermissionLvl(accountId) > PERMISSION_LVL.DEFAULT
}
