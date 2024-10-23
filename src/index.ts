import * as fs from 'fs';
import * as path from "path";
import {PNGHelper} from "./lib/pngHelper/PNGHelper.js";

const args = process.argv
const fileFlagIndex = args.findIndex(arg => arg === '--file')
const filePath = args[fileFlagIndex + 1];
const fileName = path.resolve(filePath).split('/').at(-1)
const fileExtension = fileName?.split('.').at(-1)

// Для неподдерживаемых файлов завершаем процесс
if (fileExtension !== 'png') {
    console.log('only png files supported')
    process.exit(-1);
}

fs.readFile(filePath, (err, data) => {
    if (err) {
        throw err
    }
    const png = new PNGHelper(data)
    console.log(png)
})

