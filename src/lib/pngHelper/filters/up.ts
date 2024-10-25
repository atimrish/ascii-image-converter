import {IPNGPixel} from "../interfaces/chunks.js";
import {IterableBuffer} from "../../iterableBuffer/iterableBuffer.js";
import {toRGBA} from "../helper.js";

const up = (prevLine: Array<IPNGPixel>, currentLine: Buffer): Array<IPNGPixel> => {
    const lineChunks = [...new IterableBuffer(currentLine, 4)]

    return lineChunks.map((chunk, index) => {
        const currentPixel = toRGBA(chunk)
        currentPixel.r = (currentPixel.r + prevLine[index].r) % 256
        currentPixel.g = (currentPixel.g + prevLine[index].g) % 256
        currentPixel.b = (currentPixel.b + prevLine[index].b) % 256
        currentPixel.a = (currentPixel.a + prevLine[index].a) % 256
        return currentPixel
    })
}

export {up}
