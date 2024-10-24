import {IHeaderData, IPNGChunk, IPNGLine, IPNGPixel} from "./interfaces/chunks";

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

export { bufferToNumber, chunkParser, headerParser, dataToLines, toRGBA }