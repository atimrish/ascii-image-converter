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

interface IPNGPixel {
    r: number
    g: number
    b: number
    a: number
}

interface IPNGChunk {
    length: number
    type: string
    data: Buffer
    crc: Buffer
}

interface IPNGLine {
    filter: number
    line: Buffer
}

export {IHeaderData, IPNGPixel, ColorType, BitDepth, IPNGChunk, IPNGLine}
