const fs = require('fs');
const path = require('path');

const functions = require("./functions.js");
const itemsFilePath = path.join(__dirname, '..', "shop" , 'items.json');
const itemshopFilePath = path.join(__dirname, '..', "shop" ,'itemshop', 'itemshop.json');

const rawData = fs.readFileSync(itemsFilePath);
const items = JSON.parse(rawData);


const excludedItemIds = [ //remove s12 bp stuff going into itemshop
    "AthenaLoadingScreen:lsid_213_skulldude",
    "AthenaSkyDiveContrail:trails_id_084_briefcase",
    "AthenaBackpack:bid_485_bananaagent",
    "AthenaItemWrap:wrap_203_henchman",
    "AthenaMusicPack:musicpack_044_s12cine",
    "AthenaPickaxe:pickaxe_id_361_henchmanmale1h",
    "BannerToken:bannertoken_033_s12_skull",
    "AthenaBackpack:bid_478_henchmantough",
    "AthenaDance:spid_199_bananaagent",
    "AthenaGlider:glider_id_197_henchmanmale",
    "AthenaLoadingScreen:lsid_229_mountainbase",
    "AthenaCharacter:cid_692_athena_commando_m_henchmantough",
    "AthenaLoadingScreen:lsid_216_tntina",
    "BannerToken:bannertoken_030_s12_grenade",
    "AthenaDance:emoji_s12_tntina",
    "AthenaGlider:glider_id_201_tntinafemale",
    "AthenaLoadingScreen:lsid_227_llamastormcenter",
    "AthenaPickaxe:pickaxe_id_336_tntinafemale",
    "AthenaSkyDiveContrail:trails_id_087_tntina",
    "AthenaGlider:glider_id_198_kaboom",
    "CosmeticVariantToken:vtid_560_bananaagent_styleb",
    "AthenaBackpack:bid_437_tntina",
    "AthenaCharacter:CID_701_Athena_Commando_M_BananaAgent",
    "AthenaDance:spid_190_tntina",
    "AthenaDance:eid_stepbreakdance",
    "AthenaCharacter:cid_691_athena_commando_f_tntina",
    "AthenaLoadingScreen:lsid_217_meowscles",
    "AthenaItemWrap:wrap_200_buffcat",
    "AthenaBackpack:bid_477_buffcat",
    "AthenaDance:emoji_s12_meowscles",
    "AthenaDance:eid_bangthepan",
    "AthenaLoadingScreen:lsid_228_bananaagent",
    "AthenaPickaxe:pickaxe_id_355_buffcatmale1h",
    "AthenaDance:spid_191_meowscles",
    "AthenaDance:emoji_s12_ego",
    "AthenaSkyDiveContrail:trails_id_083_alphabetsoup",
    "BannerToken:bannertoken_031_s12_kitty",
    "AthenaDance:eid_paws",
    "AthenaCharacter:cid_693_athena_commando_m_buffcat",
    "AthenaLoadingScreen:lsid_220_adventuregirl",
    "AthenaItemWrap:wrap_216_bananaagent",
    "AthenaGlider:glider_id_200_photographerfemale",
    "AthenaLoadingScreen:lsid_222_frenzyfarms",
    "AthenaBackpack:bid_473_photographer",
    "BannerToken:bannertoken_034_s12_wingedcritter",
    "AthenaDance:emoji_s12_alter",
    "AthenaPickaxe:pickaxe_id_364_photographerfemale1h",
    "AthenaSkyDiveContrail:trails_id_085_candy",
    "AthenaGlider:glider_id_199_llamahero",
    "AthenaDance:emoji_s12_adventuregirl",
    "CosmeticVariantToken:vtid_561_bananaagent_stylec",
    "AthenaDance:spid_192_adventuregirl",
    "AthenaCharacter:cid_690_athena_commando_f_photographer",
    "AthenaLoadingScreen:lsid_221_midas",
    "AthenaDance:eid_cointoss",
    "AthenaDance:spid_193_midas",
    "AthenaGlider:glider_id_202_bananaagent",
    "AthenaGlider:Glider_ID_208_BadEggMale",
    "AthenaPickaxe:pickaxe_id_360_desertopscamofemale",
    "AthenaLoadingScreen:lsid_218_teamup",
    "BannerToken:bannertoken_032_s12_roses",
    "AthenaPickaxe:pickaxe_id_357_catburglarmale",
    "AthenaMusicPack:MusicPack_000_Default",
    "AthenaMusicPack:musicpack_043_overdrive",
    "AthenaBackpack:bid_479_catburglar",
    "BannerToken:bannertoken_040_s12_midas",
    "AthenaDance:emoji_s12_midas",
    "AthenaItemWrap:wrap_201_catburglar",
    "AthenaDance:eid_jumpstyledance",
    "AthenaCharacter:cid_694_athena_commando_m_catburglar"
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


const getRandomItem = (itemsList) => {
    const filteredItems = filterExcludedItems(itemsList);
    if (filteredItems.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * filteredItems.length);
    return filteredItems[randomIndex];
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
        const item = getRandomItem(gliders);
        return {
            "itemGrants": [`AthenaGlider:${item.id}`],
            "price": getPrice(item)
        };
    })(),
    "daily2": (() => {
        const item = getRandomItem(pickaxes);
        return {
            "itemGrants": [`AthenaPickaxe:${item.id}`],
            "price": getPrice(item)
        };
    })(),
    "daily3": (() => {
        const item = getRandomItem(itemWraps);
        return {
            "itemGrants": [`AthenaItemWrap:${item.id}`],
            "price": getPrice(item)
        };
    })(),
    "daily4": (() => {
        const item = getRandomItem(gliders);
        return {
            "itemGrants": [`AthenaGlider:${item.id}`],
            "price": getPrice(item)
        };
    })(),
    "daily5": (() => {
        const item = getRandomItem(pickaxes);
        return {
            "itemGrants": [`AthenaPickaxe:${item.id}`],
            "price": getPrice(item)
        };
    })(),
    "daily6": (() => {
        const isDance = Math.random() < 0.5;
        const item = isDance ? getRandomItem(dances) : getRandomItem(musicPacks);
        
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
        } else {
            return null;
        }
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
