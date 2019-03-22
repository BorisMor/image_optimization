/**
 * Кодировать изображения в каталоге и подкаталогах
 * Если не указали каталог то смотрм каталог "uploads" на уровень ниже
 */

const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

const fs = require("fs");
const path = require('path');
const rootWeb = path.resolve(__dirname + '/../');

let dirUser = process.argv[2] ? process.argv[2] : 'uploads'; // дефольный каталог upload на уровень ниже
let existDirectory = (dir) => fs.existsSync(dir) && fs.lstatSync(dir).isDirectory();
let fullDir = existDirectory(dirUser) ? dirUser : path.resolve(rootWeb, dirUser);

if (!existDirectory(fullDir)) {
    console.log('dir not exist ', fullDir);
    return;
}

scanDirImg(fullDir);

/**
 * Сканируем каталоги в поиске изображений
 * @param workDir
 * @param extFile
 * @returns {Promise<void>}
 */
async function scanDirImg(workDir, extFile) {

    console.log(workDir);

    try {
        await setImagemin(workDir, extFile);
    } catch (e) {
        console.log('setImagemin', e.message);
    }

    let listSubDir = await fs.readdirSync(workDir);

    for (let i = 0, len = listSubDir.length; i < len; i++) {
        let currentSubDir = workDir + '/' + listSubDir[i];

        if (!await fs.lstatSync(currentSubDir).isDirectory()) {
            continue;
        }

        try {
            await scanDirImg(currentSubDir);
        } catch (e) {
            console.log('scanDirImg', e.message);
        }

    }
}

/**
 * Запустить обработку по сжатию
 * @param path
 * @param extFile
 * @returns {Promise<void>}
 */
async function setImagemin(path, extFile) {
    if (!extFile) {
        extFile = 'jpg,png,jpeg';
    }

    await imagemin([path + '/*.{' + extFile + '}'], path + '/', {
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
}
