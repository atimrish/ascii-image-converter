import {IterableBuffer} from "../../iterableBuffer/iterableBuffer.js";
import {toRGBA} from "../helper.js";
import {IPNGPixel} from "../interfaces/chunks.js";

const none = (line: Buffer): Array<IPNGPixel> => {
    const lineChunks = [... new IterableBuffer(line, 4)]
    return lineChunks.map(chunk => toRGBA(chunk))
}

export {none}
