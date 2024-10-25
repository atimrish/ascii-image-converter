import {IPNGPixel} from "../interfaces/chunks.js";
import {IterableBuffer} from "../../iterableBuffer/iterableBuffer.js";
import {toRGBA} from "../helper.js";

const calculateAverage = (current: IPNGPixel, left: IPNGPixel, above: IPNGPixel): IPNGPixel => {
    current.r = (current.r + Math.floor((left.r + above.r) / 2)) % 256
    current.g = (current.g + Math.floor((left.g + above.g) / 2)) % 256
    current.b = (current.b + Math.floor((left.b + above.b) / 2)) % 256
    current.a = (current.a + Math.floor((left.a + above.a) / 2)) % 256
    return current
}

const average = (prevLine: Array<IPNGPixel>, line: Buffer): Array<IPNGPixel> => {
    const [first, ...lineChunks] = [... new IterableBuffer(line, 4)]

    const pixels: Array<IPNGPixel> = [
        calculateAverage(
            toRGBA(first),
            {r: 0, g: 0, b: 0, a: 0},
            prevLine[0]
        )
    ]

    lineChunks.forEach((chunk, index) => {
        const current = toRGBA(chunk)
        const left = pixels[index]
        const above = prevLine[index + 1]
        pixels.push(calculateAverage(current, left, above))
    })

    return pixels
}

export {average}