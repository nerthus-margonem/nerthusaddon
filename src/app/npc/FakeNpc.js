/**
 * Class with a structure of a game NPC,
 * but having custom draw and order function.
 *
 * Used for adding custom draws into the renderer pipeline on NI
 */
export class FakeNpc
{
    order = 0
    d = {}
    alwaysDraw = true

    constructor(order, drawFunc, alwaysDraw = true)
    {
        this.order = order
        //this.draw = drawFunc
        this.alwaysDraw = alwaysDraw
    }

    draw() {}

    getOrder()
    {
        return this.order
    }

    update() {}

    updateDATA() {}

    getAlwaysDraw() { return this.alwaysDraw }

    setAlwaysDraw(alwaysDraw) { this.alwaysDraw = alwaysDraw }

    getFollowController()
    {
        return {
            checkFollowGlow: () => false
        }
    }

    isIconInvisible() { return false }

    getNick() { return '' }

    getId() { return -1 }

    drawNickOrTip() {}

    getKind() { return undefined }
}
