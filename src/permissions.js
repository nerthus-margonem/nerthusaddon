
/*
    0: normal player
    1: narrator
    2: radny
    3: xxxx
    100: dev or other spec
 */
export const PERMISSION_LVL = {DEFAULT: 0, NARRATOR: 1, COUNCILOR: 2, SPEC: 100}
export function checkPermissionLvl(nick) {
    return 2
}
