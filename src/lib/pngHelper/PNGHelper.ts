import {chunkParser, dataToLines, headerParser, linesToPixels} from "./helper.js";
import * as zlib from "zlib";
import {IHeaderData, IPNGLine, IPNGPixel} from "./interfaces/chunks.js";
import {pixelToASCII} from "../pixelToASCII/pixelToASCII.js";

interface IPNGHelper {
    signature: Buffer
    header: Partial<IHeaderData>
    data: Buffer
    pixels: Array<Array<IPNGPixel>>

    getPixel(x: number, y: number): IPNGPixel
}

class PNGHelper implements IPNGHelper {
    signature: Buffer
    header: Partial<IHeaderData>
    data: Buffer
    _lines: Array<IPNGLine>
    pixels: Array<Array<IPNGPixel>>

    constructor(buffer: Buffer) {
        this.signature = buffer.subarray(0, 8)
        const chunks = chunkParser(buffer)
        const headerChunk = chunks.find(i => i.type === 'IHDR')
        this.header = headerChunk ? headerParser(headerChunk.data) : {}
        const dataChunks = chunks.filter(i => i.type === 'IDAT')
        //тут можно реализовать отложенную инициализацию через inflate (async)
        this.data = zlib.inflateSync(Buffer.concat(dataChunks.map(i => i.data)))

        const widthForLines = this.header.width ? this.header.width : 0
        const pixelLengthInBytes = this.header.bitDepth ? Math.ceil(this.header.bitDepth / 2) : 1
        this._lines = dataToLines(this.data, widthForLines, pixelLengthInBytes)
        this.pixels = linesToPixels(this._lines)
    }


    getPixel(x: number, y: number): IPNGPixel {
        return this.pixels[y][x]
    }

    toASCII(): string {
        let result = ''
        for (let y = 0; y < this.pixels.length; y++) {
            for (let x = 0; x < this.pixels[y].length; x++) {
                result += pixelToASCII(this.getPixel(x, y))
            }
            result += '\n'
        }
        return result
    }
}

export {PNGHelper}
