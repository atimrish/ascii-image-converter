import {toRGBA} from "../helper.js";

const sub = (line: Buffer) => {
    let index = 4
    let prev = toRGBA(line.subarray(0, index))
    const pixels = [prev]

    while (index < line.length) {
        const current = toRGBA(line.subarray(index, index += 4))
        current.r = (current.r + prev.r) % 256
        current.g = (current.g + prev.g) % 256
        current.b = (current.b + prev.b) % 256
        current.a = (current.a + prev.a) % 256
        pixels.push(current)
        prev = current
    }

    return pixels
}

export {sub}