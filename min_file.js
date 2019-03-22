/**
 * Оптимизировать одино изображение
 * Параметр: путь до файла
 */

let fileName = process.argv[2];

if (!fileName) {
    console.log('not set file');
    return
}

const fs = require("fs");
const path = require('path');
const rootWeb = path.resolve(__dirname + '/../');

let workFile = undefined;
let checkFile = path.resolve(rootWeb, fileName);

// указали прямой путь до файла
if (fs.existsSync(fileName)) {
    workFile = fileName;
} else if (fs.existsSync(checkFile)) {
    workFile = checkFile;
} else {
    console.log('not found file: ', fileName);
    return;
}

const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

(async () => {
    const res = await imagemin([workFile], path.dirname(workFile), {
        plugins: [
            imageminMozjpeg({
                quality: 85,
                progressive: true,

            }),
            imageminPngquant({
                quality: [0.7, 0.8],
                strip: true
            })
        ]
    });

    console.log('ok');
})();
