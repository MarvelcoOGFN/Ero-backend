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
    const prices = {
        characters: {
            uncommon: 800,
            rare: 1200,
            epic: 1500,
            legendary: 2000,
            dark: 800,
            dc: 1200,
            gaminglegends: 1200,
            frozen: 1200,
            lava: 1200,
            marvel: 1500,
            shadow: 1200,
            icon: 1500
        },
        pickaxes: {
            uncommon: 500,
            rare: 800,
            epic: 1200,
            icon: 500,
            dark: 1200,
            frozen: 1000,
            slurp: 1500,
            dc: 1800 // might change to 800 if I feel kind
        },
        gliders: {
            uncommon: 500,
            rare: 800,
            epic: 1200,
            legendary: 1500,
            icon: 500,
            dc: 1200,
            dark: 500,
            frozen: 1000,
            marvel: 1000, // temp price will change in the future
            lava: 1200
        },
        wraps: {
            uncommon: 300,
            rare: 500,
            epic: 500
        },
        dances: {
            uncommon: 200,
            rare: 500,
            epic: 800,
            icon: 500,
            marvel: 500,
            dc: 300
        },
        backpacks: {
            uncommon: 400,
            rare: 600,
            epic: 800,
            legendary: 1000,
            marvel: 1200
        },
        musicPacks: {
            uncommon: 200,
            rare: 500,
            epic: 800
        }
    };

    switch (item.type) {
        case 'AthenaCharacter':
            return prices.characters[item.rarity] || 0;
        case 'AthenaPickaxe':
            return prices.pickaxes[item.rarity] || 0;
        case 'AthenaGlider':
            return prices.gliders[item.rarity] || 0;
        case 'AthenaItemWrap':
            return prices.wraps[item.rarity] || 0;
        case 'AthenaDance':
            return prices.dances[item.rarity] || 0;
        case 'AthenaBackpack':
            return prices.backpacks[item.rarity] || 0;
        case 'AthenaMusicPack':
            return prices.musicPacks[item.rarity] || 0;
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
