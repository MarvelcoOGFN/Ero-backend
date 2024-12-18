const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const itemsFilePath = path.join(__dirname, '..', 'shop', 'items.json');
const itemshopFilePath = path.join(__dirname, '..', 'shop', 'itemshop', 'itemshop.json');

const rawData = fs.readFileSync(itemsFilePath);
const items = JSON.parse(rawData);

const chapter = parseInt(process.env.CHAPTER, 10);
const season = parseInt(process.env.SEASON, 10);

const isItemEligible = (item) => {
    const itemChapter = item.introduction?.chapter; 
    const itemSeason = item.introduction?.season;
    
    if (itemChapter === undefined || itemSeason === undefined) {
        console.warn(`Item ${item.id} does not have valid chapter or season.`); // if this happens i am cooked
        return false;
    }

    const parsedItemChapter = parseInt(itemChapter, 10);
    const parsedItemSeason = parseInt(itemSeason, 10);

    if (parsedItemChapter < chapter) {
        return true;
    } else if (parsedItemChapter === chapter && parsedItemSeason <= season) {
        return true;
    }
    return false;
};


const filterItemsByChapterAndSeason = (itemsList) => {
    return itemsList.filter(isItemEligible);
};

const excludedItemIds = [ // add the ones you dont want in the generator (the ones added are the defualt ones that should be removed) also might add it in its own json or smth
	"CID_563_Athena_Commando_M_RebirthDefaultD",
	"CID_562_Athena_Commando_M_RebirthDefaultC",
	"CID_561_Athena_Commando_M_RebirthDefaultB",
	"CID_560_Athena_Commando_M_RebirthDefaultA",
	"CID_559_Athena_Commando_F_RebirthDefaultD",
	"CID_558_Athena_Commando_F_RebirthDefaultC",
	"CID_557_Athena_Commando_F_RebirthDefaultB",
	"CID_556_Athena_Commando_F_RebirthDefaultA",
	"CID_TBD_Athena_Commando_M_Nutcracker_CINE",
	"CID_TBD_Athena_Commando_M_ConstructorTest",
	"CID_TBD_Athena_Commando_M_Banana_CINE",
	"CID_TBD_Athena_Commando_F_ConstructorTest",
	"CID_NPC_Athena_Commando_M_TacticalFishermanOil",
	"CID_NPC_Athena_Commando_M_PaddedArmorArctic",
    "CID_NPC_Athena_Commando_M_HenchmanGood",
	"CID_NPC_Athena_Commando_M_HenchmanBad",
	"CID_NPC_Athena_Commando_M_PaddedArmorArctic",
	"CID_636_Athena_Commando_M_GalileoGondola_78MFZ",
	"CID_637_Athena_Commando_M_GalileoOutrigger_7Q0YU",
	"CID_707_Athena_Commando_M_HenchmanGood",
	"CID_706_Athena_Commando_M_HenchmanBad",
    "CID_001_Athena_Commando_F_Default",
    "cid_a_272_athena_commando_f_prime",
    "EID_DanceMoves",
    "EID_BoogieDown"
]; 

const filterExcludedItems = (itemsList) => {
    const filteredItems = itemsList.filter(item => !excludedItemIds.includes(item.id));
    //console.log(`Filtered items: ${filteredItems.length}`); //Debugging
    return filteredItems;
};

const backpacks = filterExcludedItems(filterItemsByChapterAndSeason(items.filter(item => item.type === 'AthenaBackpack')));
const pickaxes = filterExcludedItems(filterItemsByChapterAndSeason(items.filter(item => item.type === 'AthenaPickaxe')));
const characters = filterExcludedItems(filterItemsByChapterAndSeason(items.filter(item => item.type === 'AthenaCharacter')));
const itemWraps = filterExcludedItems(filterItemsByChapterAndSeason(items.filter(item => item.type === 'AthenaItemWrap')));
const musicPacks = filterExcludedItems(filterItemsByChapterAndSeason(items.filter(item => item.type === 'AthenaMusicPack')));
const dances = filterExcludedItems(filterItemsByChapterAndSeason(items.filter(item => item.type === 'AthenaDance')));
const gliders = filterExcludedItems(filterItemsByChapterAndSeason(items.filter(item => item.type === 'AthenaGlider')));
const contrails = filterExcludedItems(filterItemsByChapterAndSeason(items.filter(item => item.type === 'AthenaSkyDiveContrail')));

const usedItemIds = new Set();

const getUniqueItem = (itemsList) => {
    const availableItems = itemsList.filter(item => !usedItemIds.has(item.id));
   // console.log(`Available items: ${availableItems.length}`); // Debugging
    if (availableItems.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * availableItems.length);
    const item = availableItems[randomIndex];
    usedItemIds.add(item.id);
    return item;
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
            starwars: 2000,
            slurp: 1800,
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
            starwars: 800,
            shadow: 1000,
            marvel: 800,
            dc: 800 
        },
        gliders: {
            common: 100, // this is for the victory gliders
            uncommon: 500,
            rare: 800,
            epic: 1200,
            legendary: 1500,
            icon: 500,
            dc: 1200,
            dark: 500,
            frozen: 1000,
            shadow: 1000,
            slurp: 1000,
            starwars: 1000,
            marvel: 1000, 
            lava: 1200
        },
        wraps: {
            uncommon: 300,
            rare: 500,
            starwars: 750,
            epic: 500,
            legendary: 750,
            icon: 750,
            dc: 1000,
            dark: 750,
            shadow: 750,
            slurp: 750,
            frozen: 1000,
            starwars: 1000,
            marvel: 1000, 
            lava: 750
        },
        dances: {
            uncommon: 200,
            rare: 500,
            epic: 800,
            icon: 500,
            marvel: 500,
            starwars: 500,
            dc: 300,
            dark: 800,
            slurp: 750,
            frozen: 800,
            shadow: 500,
            starwars: 800,
            lava: 800
        },
        contrails: {
            uncommon: 300,
            rare: 500,
            starwars: 750,
            epic: 500,
            legendary: 750,
            icon: 750,
            dc: 1000,
            dark: 750,
            shadow: 750,
            frozen: 1000,
            starwars: 1000,
            slurp: 750,
            marvel: 1000, 
            lava: 750
        },
        backpacks: {
            uncommon: 400,
            rare: 600,
            epic: 800,
            legendary: 1000,
            starwars: 1500,
            marvel: 1200,
            starwars: 500,
            dc: 1200,
            dark: 800,
            slurp: 1000,
            shadow: 1000,
            frozen: 1200,
            lava: 800
        },
        musicPacks: {
            uncommon: 200,
            rare: 300,
            starwars: 750,
            epic: 500,
            legendary: 750,
            icon: 750,
            dc: 1000,
            dark: 750,
            slurp: 500,
            frozen: 1000,
            starwars: 1000,
            marvel: 1000, 
            lava: 750
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
        case 'AthenaSkyDiveContrail':
            return prices.contrails[item.rarity] || 0;
        case 'AthenaMusicPack':
            return prices.musicPacks[item.rarity] || 0;
        default:
            return 0;
    }
};

const config = {
    "daily1": (() => {
        const item = getUniqueItem(gliders);
        return item ? {
            "itemGrants": [`AthenaGlider:${item.id}`],
            "price": getPrice(item)
        } : null;
    })(),
    "daily2": (() => {
        const iscontrail = Math.random() < 0.6;
        const item = iscontrail ? getUniqueItem(pickaxes) : getUniqueItem(contrails);     
        if (item) {
            if (item.type === 'AthenaPickaxe') {
                return {
                    "itemGrants": [`AthenaPickaxe:${item.id}`],
                    "price": getPrice(item)
                };
            } else if (item.type === 'AthenaSkyDiveContrail') {
                return {
                    "itemGrants": [`AthenaSkyDiveContrail:${item.id}`],
                    "price": getPrice(item)
                };
            }
        }
        return null;
    })(),
    "daily3": (() => {
        const item = getUniqueItem(itemWraps);
        return item ? {
            "itemGrants": [`AthenaItemWrap:${item.id}`],
            "price": getPrice(item)
        } : null;
    })(),
    "daily4": (() => {
        const item = getUniqueItem(gliders);
        return item ? {
            "itemGrants": [`AthenaGlider:${item.id}`],
            "price": getPrice(item)
        } : null;
    })(),
    "daily5": (() => {
        const isBackpack = Math.random() < 0.5;
        const item = isBackpack ? getUniqueItem(backpacks) : getUniqueItem(pickaxes);     
        if (item) {
            if (item.type === 'AthenaPickaxe') {
                return {
                    "itemGrants": [`AthenaPickaxe:${item.id}`],
                    "price": getPrice(item)
                };
            } else if (item.type === 'AthenaBackpack') {
                return {
                    "itemGrants": [`AthenaBackpack:${item.id}`],
                    "price": getPrice(item)
                };
            }
        }
        return null;
    })(),
    "daily6": (() => {
        const isDance = Math.random() < 0.5;
        const item = isDance ? getUniqueItem(dances) : getUniqueItem(musicPacks);     
        if (item) {
            if (item.type === 'AthenaDance') {
                return {
                    "itemGrants": [`AthenaDance:${item.id}`],
                    "price": getPrice(item)
                };
            } else if (item.type === 'AthenaMusicPack') {
                return {
                    "itemGrants": [`AthenaMusicPack:${item.id}`],
                    "price": getPrice(item)
                };
            }
        }
        return null;
    })(),
    "featured1": (() => {
        const item = getUniqueItem(characters);
        return item ? {
            "itemGrants": [`AthenaCharacter:${item.id}`],
            "price": getPrice(item)
        } : null;
    })(),
    "featured2": (() => {
        const item = getUniqueItem(characters);
        return item ? {
            "itemGrants": [`AthenaCharacter:${item.id}`],
            "price": getPrice(item)
        } : null;
    })(),
    "featured3": (() => {
        const item = getUniqueItem(characters);
        return item ? {
            "itemGrants": [`AthenaCharacter:${item.id}`],
            "price": getPrice(item)
        } : null;
    })()
};

fs.writeFileSync(itemshopFilePath, JSON.stringify(config, null, 2));