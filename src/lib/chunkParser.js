const bufferToNumber = (buffer) => +`0x${buffer.toString('hex')}`

/**
 *
 * @param buffer
 * @returns {{
 *     length: number,
 *     type: string,
 *     data: Buffer,
 *     crc: Buffer,
 * }[]}
 */
const chunkParser = (buffer) => {
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

const headerParser = (buffer) => {
    return {
        width: bufferToNumber(buffer.subarray(0, 4)),
        height: bufferToNumber(buffer.subarray(4, 8)),
        bitDepth: buffer[8],
        colorType: buffer[9],
        compressionMethod: buffer[10],
        filterMethod: buffer[11],
        interlaceMethod: buffer[12],
    }
}

export { chunkParser, headerParser }