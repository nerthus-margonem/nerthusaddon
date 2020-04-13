export function Simple1DNoise(seed)
{
    seed = seed || 2019
    const MAX_VERTICES = 256
    const MAX_VERTICES_MASK = MAX_VERTICES - 1
    let amplitude = 1
    let scale = 0.21

    let r = []

    function Random(seed)
    {
        this._seed = seed % 2147483647
        if (this._seed <= 0) this._seed += 2147483646

        this.next = function next()
        {
            return this._seed = this._seed * 16807 % 2147483647
        }
        this.getFloat = function ()
        {
            return (this.next() - 1) / 2147483646
        }
    }

    const rand = new Random(seed)
    for (let i = 0; i < MAX_VERTICES; ++i)
        r.push(rand.getFloat())

    function getVal(x)
    {
        const scaledX = x * scale
        const xFloor = Math.floor(scaledX)
        const t = scaledX - xFloor
        const tRemapSmoothstep = t * t * (3 - 2 * t)

        const xMin = xFloor % MAX_VERTICES_MASK
        const xMax = (xMin + 1) % MAX_VERTICES_MASK

        const y = lerp(r[xMin], r[xMax], tRemapSmoothstep)

        return y * amplitude
    }

    /**
     * Linear interpolation function.
     * @param a The lower integer value
     * @param b The upper integer value
     * @param t The value between the two
     * @returns {number}
     */
    function lerp(a, b, t)
    {
        return a * (1 - t) + b * t
    }

    // return the API
    return {
        getVal: getVal,
        setAmplitude: function (newAmplitude)
        {
            amplitude = newAmplitude
        },
        setScale: function (newScale)
        {
            scale = newScale
        }
    }
}
