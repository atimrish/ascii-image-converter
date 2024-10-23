import {chunkParser, headerParser} from "./helper.js";
import * as zlib from "zlib";

type ColorType = 0 | 2 | 3 | 4 | 6
type BitDepth = 1 | 2 | 4 | 8 | 16

interface IHeaderData {
    width: number
    height: number
    bitDepth: BitDepth
    colorType: ColorType
    compressionMethod: number
    filterMethod: number
    interlaceMethod: number
}

interface IPNGHelper {
    signature: Buffer
    header: IHeaderData | undefined
    data: Buffer
    getPixel(x: number, y: number): IPNGPixel
}

interface IPNGPixel {
    r: number
    g: number
    b: number
    a: number
}

class PNGHelper implements IPNGHelper {
    signature: Buffer
    header: IHeaderData | undefined
    data: Buffer

    constructor(buffer: Buffer) {
        this.signature = buffer.subarray(0, 8)
        const chunks = chunkParser(buffer)
        const headerChunk = chunks.find(i => i.type === 'IHDR')
        this.header = headerChunk ? headerParser(headerChunk.data) : undefined
        const dataChunks = chunks.filter(i => i.type === 'IDAT')
        //тут можно реализовать отложенную инициализацию через inflate (async)
        this.data = zlib.inflateSync(Buffer.concat(dataChunks.map(i => i.data)))
    }

    getPixel(x: number, y: number): IPNGPixel {
        ///TODO: реализовать метод получения пикселя
        return {r: 0, g: 0, b: 0, a: 0}
    }

}

export {IHeaderData, IPNGHelper, IPNGPixel, PNGHelper}
