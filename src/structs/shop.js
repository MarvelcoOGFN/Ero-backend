const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

const getNewItemshopTime = () => {
    const now = new Date();
    now.setUTCDate(now.getUTCDate() + 1);
    now.setUTCHours(0, 0, 0, 0); 
    return now.toISOString();
  };
  
  const ItemshopTime = getNewItemshopTime();
  async function sleep(ms) {
    await new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    })
  }
  
  function getOfferID(offerId) {
    const catalog = getItemShop();
  
    for (let storefront of catalog.storefronts) {
      let findOfferId = storefront.catalogEntries.find(i => i.offerId == offerId);
  
      if (findOfferId) return {
        name: storefront.name,
        offerId: findOfferId
      };
    }
  }
  
  function getItemShop() { 
    const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "shop", "catalog.json")).toString());
    const CatalogConfig = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "shop", "itemshop", "itemshop.json")).toString());
  
    try {
        for (let value in CatalogConfig) {
            if (!Array.isArray(CatalogConfig[value].itemGrants)) continue;
            if (CatalogConfig[value].itemGrants.length == 0) continue;
  
            const CatalogEntry = {
                "devName": "",
                "offerId": "",
                "fulfillmentIds": [],
                "dailyLimit": -1,
                "weeklyLimit": -1,
                "monthlyLimit": -1,
                "categories": [],
                "prices": [{
                    "currencyType": "MtxCurrency",
                    "currencySubType": "",
                    "regularPrice": 0,
                    "finalPrice": 0,
                    "saleExpiration": ItemshopTime,
                    "basePrice": 0
                }],
                "meta": {
                    "SectionId": "Featured",
                    "TileSize": "Small"
                },
                "matchFilter": "",
                "filterWeight": 0,
                "appStoreId": [],
                "requirements": [],
                "offerType": "StaticPrice",
                "giftInfo": {
                    "bIsEnabled": true,
                    "forcedGiftBoxTemplateId": "",
                    "purchaseRequirements": [],
                    "giftRecordIds": []
                },
                "refundable": true,
                "metaInfo": [{
                    "key": "SectionId",
                    "value": "Featured"
                }, {
                    "key": "TileSize",
                    "value": "Small"
                }],
                "displayAssetPath": "",
                "itemGrants": [],
                "sortPriority": 0,
                "catalogGroupPriority": 0
            };
  
            let i = catalog.storefronts.findIndex(p => p.name == (value.toLowerCase().startsWith("daily") ? "BRDailyStorefront" : "BRWeeklyStorefront"));
            if (i == -1) continue;
  
            if (value.toLowerCase().startsWith("daily")) {
                CatalogEntry.sortPriority = -1;
            } else {
                CatalogEntry.meta.TileSize = "Normal";
                CatalogEntry.metaInfo[1].value = "Normal";
            }
  
            for (let itemGrant of CatalogConfig[value].itemGrants) {
                if (typeof itemGrant != "string") continue;
                if (itemGrant.length == 0) continue;
  
                CatalogEntry.requirements.push({
                    "requirementType": "DenyOnItemOwnership",
                    "requiredId": itemGrant,
                    "minQuantity": 1
                });
                CatalogEntry.itemGrants.push({
                    "templateId": itemGrant,
                    "quantity": 1
                });
            }
  
            CatalogEntry.prices = [{
                "currencyType": "MtxCurrency",
                "currencySubType": "",
                "regularPrice": CatalogConfig[value].price,
                "finalPrice": CatalogConfig[value].price,
                "saleExpiration": ItemshopTime,
                "basePrice": CatalogConfig[value].price
            }];
  
            if (CatalogEntry.itemGrants.length > 0) {
                let uniqueIdentifier = crypto.createHash("sha1").update(`${JSON.stringify(CatalogConfig[value].itemGrants)}_${CatalogConfig[value].price}`).digest("hex");
  
                CatalogEntry.devName = uniqueIdentifier;
                CatalogEntry.offerId = uniqueIdentifier;
  
                catalog.storefronts[i].catalogEntries.push(CatalogEntry);
            }
        }
    } catch {}
  
    return catalog;
  }

  module.exports = {
    sleep,
    getItemShop,
    getOfferID,
}