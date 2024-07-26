const fs = require('fs');
const path = require('path');

const itemsFilePath = path.join(__dirname, '..', 'shop', 'items.json');
const itemshopFilePath = path.join(__dirname, '..', 'shop', 'itemshop', 'itemshop.json');

const rawData = fs.readFileSync(itemsFilePath);
const items = JSON.parse(rawData);

const excludedItemIds = [ //remove s12 bp stuff going into itemshop
    "lsid_213_skulldude",
    "trails_id_084_briefcase",
    "bid_485_bananaagent",
    "wrap_203_henchman",
    "musicpack_044_s12cine",
    "pickaxe_id_361_henchmanmale1h",
    "bannertoken_033_s12_skull",
    "bid_478_henchmantough",
    "spid_199_bananaagent",
    "glider_id_197_henchmanmale",
    "lsid_229_mountainbase",
    "cid_692_athena_commando_m_henchmantough",
    "lsid_216_tntina",
    "bannertoken_030_s12_grenade",
    "emoji_s12_tntina",
    "glider_id_201_tntinafemale",
    "lsid_227_llamastormcenter",
    "pickaxe_id_336_tntinafemale",
    "trails_id_087_tntina",
    "glider_id_198_kaboom",
    "vtid_560_bananaagent_styleb",
    "bid_437_tntina",
    "CID_701_Athena_Commando_M_BananaAgent",
    "spid_190_tntina",
    "eid_stepbreakdance",
    "cid_691_athena_commando_f_tntina",
    "lsid_217_meowscles",
    "wrap_200_buffcat",
    "bid_477_buffcat",
    "emoji_s12_meowscles",
    "eid_bangthepan",
    "lsid_228_bananaagent",
    "pickaxe_id_355_buffcatmale1h",
    "spid_191_meowscles",
    "emoji_s12_ego",
    "trails_id_083_alphabetsoup",
    "bannertoken_031_s12_kitty",
    "eid_paws",
    "cid_693_athena_commando_m_buffcat",
    "lsid_220_adventuregirl",
    "wrap_216_bananaagent",
    "glider_id_200_photographerfemale",
    "lsid_222_frenzyfarms",
    "bid_473_photographer",
    "bannertoken_034_s12_wingedcritter",
    "emoji_s12_alter",
    "pickaxe_id_364_photographerfemale1h",
    "trails_id_085_candy",
    "glider_id_199_llamahero",
    "emoji_s12_adventuregirl",
    "vtid_561_bananaagent_stylec",
    "spid_192_adventuregirl",
    "cid_690_athena_commando_f_photographer",
    "lsid_221_midas",
    "eid_cointoss",
    "spid_193_midas",
    "glider_id_202_bananaagent",
    "Glider_ID_208_BadEggMale",
    "pickaxe_id_360_desertopscamofemale",
    "lsid_218_teamup",
    "bannertoken_032_s12_roses",
    "pickaxe_id_357_catburglarmale",
    "MusicPack_000_Default",
    "musicpack_043_overdrive",
    "bid_479_catburglar",
    "bannertoken_040_s12_midas",
    "emoji_s12_midas",
    "wrap_201_catburglar",
    "eid_jumpstyledance",
    "CID_762_Athena_Commando_M_BrightGunnerSpy",
    "cid_694_athena_commando_m_catburglar"
];

const filterExcludedItems = (itemsList) => {
    return itemsList.filter(item => !excludedItemIds.includes(item.id));
};

const backpacks = filterExcludedItems(items.filter(item => item.type === 'AthenaBackpack'));
const pickaxes = filterExcludedItems(items.filter(item => item.type === 'AthenaPickaxe'));
const characters = filterExcludedItems(items.filter(item => item.type === 'AthenaCharacter'));
const itemWraps = filterExcludedItems(items.filter(item => item.type === 'AthenaItemWrap'));
const musicPacks = filterExcludedItems(items.filter(item => item.type === 'AthenaMusicPack'));
const dances = filterExcludedItems(items.filter(item => item.type === 'AthenaDance'));
const gliders = filterExcludedItems(items.filter(item => item.type === 'AthenaGlider'));


const usedItemIds = new Set();

const getUniqueItem = (itemsList) => {
    const availableItems = itemsList.filter(item => !usedItemIds.has(item.id));
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
            starwars: 1000,
            dc: 1800 
        },
        gliders: {
            common: 100,
            uncommon: 500,
            rare: 800,
            epic: 1200,
            legendary: 1500,
            icon: 500,
            dc: 1200,
            dark: 500,
            frozen: 1000,
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
            frozen: 800,
            starwars: 800,
            lava: 800
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
        case 'AthenaMusicPack':
            return prices.musicPacks[item.rarity] || 0;
        default:
            return 0;
    }
};

const config = {
    "//": "BR Item Shop Config",
    "daily1": (() => {
        const item = getUniqueItem(gliders);
        return item ? {
            "itemGrants": [`AthenaGlider:${item.id}`],
            "price": getPrice(item)
        } : null;
    })(),
    "daily2": (() => {
        const item = getUniqueItem(pickaxes);
        return item ? {
            "itemGrants": [`AthenaPickaxe:${item.id}`],
            "price": getPrice(item)
        } : null;
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
        const item = getUniqueItem(pickaxes);
        return item ? {
            "itemGrants": [`AthenaPickaxe:${item.id}`],
            "price": getPrice(item)
        } : null;
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