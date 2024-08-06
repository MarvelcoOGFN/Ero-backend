const express = require("express");
const fs = require("fs");
const router = express.Router();
const Profile = require("../model/profiles.js");
const Friends = require("../model/friends.js");
const crypto = require("crypto");
const path = require("path");

const { verifyToken, verifyClient } = require("../token/tokenVerify.js");
const keychain = require("../keychain/keychain.json");

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
              "refundable": false,
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

router.get("/fortnite/api/storefront/v2/catalog", (req, res) => {
if (req.headers["user-agent"].includes("2870186")) {
  return res.status(404).end();
}

res.json(getItemShop());
});

router.get("/fortnite/api/storefront/v2/gift/check_eligibility/recipient/:recipientId/offer/:offerId",
  verifyToken,
  async (req, res) => {
    const findOfferId = getOfferID(req.params.offerId);
    if (!findOfferId) {
      return createError(
        "errors.com.epicgames.fortnite.id_invalid",
        `Offer ID (id: "${req.params.offerId}") not found`,
        [req.params.offerId],
        16027,
        undefined,
        400,
        res
      );
    }

    let sender = await Friends.findOne({ accountId: req.user.accountId }).lean();

    if (
      !sender.list.accepted.find(
        (i) => i.accountId == req.params.recipientId
      ) &&
      req.params.recipientId != req.user.accountId
    ) {
      return createError(
        "errors.com.epicgames.friends.no_relationship",
        `User ${req.user.accountId} is not friends with ${req.params.recipientId}`,
        [req.user.accountId, req.params.recipientId],
        28004,
        undefined,
        403,
        res
      );
    }

    const profiles = await Profile.findOne({ accountId: req.params.recipientId });

    let athena = profiles.profiles["athena"];

    for (let itemGrant of findOfferId.offerId.itemGrants) {
      for (let itemId in athena.items) {
        if (
          itemGrant.templateId.toLowerCase() ==
          athena.items[itemId].templateId.toLowerCase()
        ) {
          return createError(
            "errors.com.epicgames.modules.gamesubcatalog.purchase_not_allowed",
            `Could not purchase catalog offer ${findOfferId.offerId.devName}, item ${itemGrant.templateId}`,
            [findOfferId.offerId.devName, itemGrant.templateId],
            28004,
            undefined,
            403,
            res
          );
        }
      }
    }

    res.json({
      price: findOfferId.offerId.prices[0],
      items: findOfferId.offerId.itemGrants,
    });
  }
);

router.get("/fortnite/api/storefront/v2/keychain", (req, res) => {
  res.json(keychain);
});

router.get("/catalog/api/shared/bulk/offers", (req, res) => {
  res.json({});
});

module.exports = router;

function createError(
  errorCode,
  errorMessage,
  errorParams,
  errorCodeValue,
  undefinedValue,
  status,
  res
) {
  return res.status(status).json({
    errorCode: errorCode,
    errorMessage: errorMessage,
    errorParams: errorParams,
    errorCodeValue: errorCodeValue,
    undefinedValue: undefinedValue,
  });
}
