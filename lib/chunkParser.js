const chunkParser = (buffer) => {
    const payload = buffer.subarray(8)
    const chunks = []
    const MAX_ITERATIONS = 100_000
    let i = 0
    let index = 0
    while (i < MAX_ITERATIONS && index < payload.length) {
        const lengthBytes =
            payload
            .subarray(index, index += 4)

        const preparedLengthString = lengthBytes.reduce((acc, cur) => acc + cur.toString(16).padStart(2, '0'), '')
        const length = +`0x${preparedLengthString}`
        const type = payload.subarray(index, index += 4).toString()
        const data = payload.subarray(index, index += length)
        const crc = payload.subarray(index, index += 4)
        chunks.push({
            length,
            type,
            data,
            crc
        })
        i++
    }
    return chunks
}

export { chunkParser }