import {subFilter} from "./filters/subFilter.js";

/**
 *
 * @param {Buffer} line
 */
const lineToPixels = (line) => {
    const filter = line[0]
    const bytes = line.subarray(1)
    ///TODO: вычислять днину чанка пикселя
    subFilter(bytes, 4)
}

export {lineToPixels}