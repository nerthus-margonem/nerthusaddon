export class Random {
  #seed: number;

  constructor(seed: number) {
    this.#seed = seed % 2147483647;
    if (this.#seed <= 0) {
      this.#seed += 2147483646;
    }
  }

  next(): number {
    this.#seed = (this.#seed * 16807) % 2147483647;
    return this.#seed;
  }
  getFloat(): number {
    return (this.next() - 1) / 2147483646;
  }
}

export class Simple1DNoise {
  #MAX_VERTICES = 256;
  #MAX_VERTICES_MASK = this.#MAX_VERTICES - 1;
  #scale = 0.21;
  #amplitude = 1;

  #r: number[] = [];

  constructor(seed = 2019) {
    const rand = new Random(seed);
    for (let i = 0; i < this.#MAX_VERTICES; ++i) {
      this.#r.push(rand.getFloat());
    }
  }

  setScale(scale: number): void {
    this.#scale = scale;
  }

  setAmplitude(amplitude: number): void {
    this.#amplitude = amplitude;
  }

  getVal(x: number): number {
    const scaledX = x * this.#scale;
    const xFloor = Math.floor(scaledX);
    const t = scaledX - xFloor;
    const tRemapSmoothstep = t * t * (3 - 2 * t);

    const xMin = xFloor % this.#MAX_VERTICES_MASK;
    const xMax = (xMin + 1) % this.#MAX_VERTICES_MASK;

    const y = this.#lerp(this.#r[xMin]!, this.#r[xMax]!, tRemapSmoothstep);

    return y * this.#amplitude;
  }

  /**
   * Linear interpolation function.
   * @param {number} a The lower integer value
   * @param {number} b The upper integer value
   * @param {number} t The value between the two
   * @returns {number}
   */
  #lerp(a: number, b: number, t: number): number {
    return a * (1 - t) + b * t;
  }
}

/**
 * Modified version of 1d noise from Michael Bromley:
 *
 * The MIT License (MIT)
 * Copyright (c) 2014 Michael Bromley
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
