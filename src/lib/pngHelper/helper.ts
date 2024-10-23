import {IHeaderData, IPNGPixel} from "./PNGHelper.js";

interface IPNGChunk {
    length: number
    type: string
    data: Buffer
    crc: Buffer
}

interface IPNGLine {
    filter: number
    pixels: Array<IPNGPixel>
}

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

// const dataToLines = (data: Buffer, width: number, pixelLengthInBytes: number): Array<IPNGLine> => {
//     const lines = []
//     let index = 0
//     while (index < data.length) {
//
//         const line = {
//             filter: data[index],
//             line: data.subarray(index, index += 1 + width * pixelLengthInBytes)
//         }
//         lines.push(line)
//     }
//
//     return lines
// }

export { bufferToNumber, chunkParser, headerParser }