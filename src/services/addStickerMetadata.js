fs = require("fs");
const path = require("path");
const webp = require("node-webpmux");
const { getRandomName, getRandomNumber } = require("../utils");

const addStickerMetadata = async (media, metadata) => {
    const tmpFileIn = getRandomName("webp");
    const tmpFileOut = getRandomName("webp");

    await fs.promises.writeFile(tmpFileIn, media);

    const img = new webp.Image();
    const json = {
        "sticker-pack-id": `${getRandomNumber(10_000, 99_999)}`,
        "sticker-pack-name": metadata.username,
        "sticker-pack-publisher": metadata.botName,
        emojis: metadata.categories ? metadata.categories : [""]
    };
    const exifAttr = Buffer.from([
        0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57,
        0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00
    ]);
    const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
    const exif = Buffer.concat([exifAttr, jsonBuff]);
    exif.writeUIntLE(jsonBuff.length, 14, 4);

    await img.load(tmpFileIn);
    await fs.promises.unlink(tmpFileIn);
    img.exif = exif;
    await img.save(tmpFileOut);
    return tmpFileOut;
};

module.exports = addStickerMetadata;
