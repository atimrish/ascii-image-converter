import {toRGBA} from "../helper.js";
import {IterableBuffer} from "../../iterableBuffer/iterableBuffer.js";

const sub = (line: Buffer) => {

    const iterable = new IterableBuffer(line, 4)
    const [first, ...lineChunks] = [...iterable]
    let prev = toRGBA(first)
    const pixels = [prev]

    for (const currentChunk of lineChunks) {
        const current = toRGBA(currentChunk)
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