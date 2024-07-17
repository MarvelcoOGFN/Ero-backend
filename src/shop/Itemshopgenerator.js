const fs = require('fs');
const path = require('path');


const itemsFilePath = path.join(__dirname, '.', 'items.json');
const itemshopFilePath = path.join(__dirname, '.', 'itemshop', 'itemshop.json');


const rawData = fs.readFileSync(itemsFilePath);
const items = JSON.parse(rawData);


const backpacks = items.filter(item => item.type === 'AthenaBackpack');
const pickaxes = items.filter(item => item.type === 'AthenaPickaxe');
const characters = items.filter(item => item.type === 'AthenaCharacter');
const itemWraps = items.filter(item => item.type === 'AthenaItemWrap');
const musicPacks = items.filter(item => item.type === 'AthenaMusicPack');


const getRandomItem = (itemsList) => {
    if (itemsList.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * itemsList.length);
    return itemsList[randomIndex];
};


const getPrice = (item) => {
    switch (item.rarity) {
        case 'uncommon':
            return item.type === 'AthenaCharacter' ? 800 : 400;
        case 'rare':
            return item.type === 'AthenaCharacter' ? 1200 : 500;
        case 'epic':
            return 1500;
        case 'legendary':
            return 2000;
        case 'icon':
            return 1500;
        case 'dc':
            return 1500;
        case 'marvel':
            return 1500;
        case 'shadow':
            return 1500;
         case 'rare':
             return item.type === 'AthenaCharacter' ? 1500 : 500;
        default:
            return 0;
    }
};


const config = {
    "//": "BR Item Shop Config",
    "daily1": (() => {
        const item = getRandomItem(backpacks);
        return {
            "itemGrants": [`AthenaBackpack:${item.id}`],
            "price": getPrice(item)
        };
    })(),
    "daily2": (() => {
        const item = getRandomItem(backpacks);
        return {
            "itemGrants": [`AthenaBackpack:${item.id}`],
            "price": getPrice(item)
        };
    })(),
    "daily3": (() => {
        const item = getRandomItem(backpacks);
        return {
            "itemGrants": [`AthenaPickaxe:${item.id}`],
            "price": getPrice(item)
        };
    })(),
    "daily4": (() => {
        const item = getRandomItem(pickaxes);
        return {
            "itemGrants": [`AthenaPickaxe:${item.id}`],
            "price": getPrice(item)
        };
    })(),
    "daily5": (() => {
        const item = getRandomItem(musicPacks);
        return {
            "itemGrants": [`AthenaMusicPack:${item.id}`],
            "price": getPrice(item)
        };
    })(),
    "daily6": (() => {
        const item = getRandomItem(itemWraps);
        return {
            "itemGrants": [`AthenaItemWrap:${item.id}`],
            "price": getPrice(item)
        };
    })(),
    "featured1": (() => {
        const item = getRandomItem(characters);
        return {
            "itemGrants": [`AthenaCharacter:${item.id}`],
            "price": getPrice(item)
        };
    })(),
    "featured2": (() => {
        const item = getRandomItem(characters);
        return {
            "itemGrants": [`AthenaCharacter:${item.id}`],
            "price": getPrice(item)
        };
    })(),
    "featured3": (() => {
        const item = getRandomItem(characters);
        return {
            "itemGrants": [`AthenaCharacter:${item.id}`],
            "price": getPrice(item)
        };
    })()
};


fs.writeFileSync(itemshopFilePath, JSON.stringify(config, null, 2));
