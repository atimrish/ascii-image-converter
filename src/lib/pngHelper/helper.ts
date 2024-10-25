import {IHeaderData, IPNGChunk, IPNGLine, IPNGPixel} from "./interfaces/chunks.js";
import {sub} from "./filters/sub.js";
import {up} from "./filters/up.js";
import {average} from "./filters/average.js";
import {paeth} from "./filters/paeth.js";
import {none} from "./filters/none.js";

const bufferToNumber = (buffer: Buffer) => +`0x${buffer.toString('hex')}`

const chunkParser = (buffer: Buffer): Array<IPNGChunk> => {
    const payload = buffer.subarray(8)
    const chunks = []
    const MAX_ITERATIONS = 100_000
    let i = 0
    let index = 0
    while (i < MAX_ITERATIONS && index < payload.length) {
        const length = bufferToNumber(payload.subarray(index, index += 4))
        const type = payload.subarray(index, index += 4).toString()
        const data = payload.subarray(index, index += length)

        const crc = payload.subarray(index, index += 4)
        chunks.push({ length, type, data, crc })
        i++
    }
    return chunks
}

const headerParser = (buffer: Buffer): IHeaderData => {
    return {
        width: bufferToNumber(buffer.subarray(0, 4)),
        height: bufferToNumber(buffer.subarray(4, 8)),
        bitDepth: buffer[8] as IHeaderData['bitDepth'],
        colorType: buffer[9] as IHeaderData['colorType'],
        compressionMethod: buffer[10],
        filterMethod: buffer[11],
        interlaceMethod: buffer[12],
    }
}

const dataToLines = (data: Buffer, width: number, pixelLengthInBytes: number): Array<IPNGLine> => {
    const lines = []
    let index = 0
    while (index < data.length) {
        lines.push({
            filter: data[index++],
            line: data.subarray(index, index += width * pixelLengthInBytes)
        })
    }
    return lines
}

const toRGBA = (buffer: Buffer): IPNGPixel => {
    return {
        r: buffer[0],
        g: buffer[1],
        b: buffer[2],
        a: buffer[3]
    }
}

const linesToPixels = (lines: Array<IPNGLine>): Array<Array<IPNGPixel>> => {
    const formatted: Array<Array<IPNGPixel>> = []

    for (let i = 0; i < lines.length; i++) {
        let pixels
        switch (lines[i].filter) {
            case 1:
                pixels = sub(lines[i].line)
                break
            case 2:
                pixels = up(formatted[i - 1], lines[i].line)
                break
            case 3:
                pixels = average(formatted[i - 1], lines[i].line)
                break
            case 4:
                pixels = paeth(formatted[i - 1], lines[i].line)
                break
            case 0:
            default:
                pixels = none(lines[i].line)
                break
        }
        formatted.push(pixels)
    }

    return formatted
}

export { bufferToNumber, chunkParser, headerParser, dataToLines, toRGBA, linesToPixels }