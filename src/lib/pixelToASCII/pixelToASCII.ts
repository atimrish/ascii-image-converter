import {IPNGPixel} from "../pngHelper/interfaces/chunks.js";

const chars = [
    ' ',
    '`',
    '\'',
    '"',
    '^',
    '-',
    '~',
    '+',
    '*',
    '=',
    '<',
    '>',
    '.',
    ',',
    '_',
    ':',
    ';',
    '!',
    '|',
    '?',
    '%',
    '#',
    '\\',
    '/',
    '(',
    ')',
    '[',
    ']',
    '&',
    '@',
    '$',
    '0'
]

const pixelToASCII = (pixel: IPNGPixel): string => {
    const maxBright = Math.max(pixel.r, pixel.g, pixel.b) * (pixel.a / 255)
    const index = Math.round(maxBright / 8) - 1
    return chars[Math.max(0, index)]
}

export {pixelToASCII}
