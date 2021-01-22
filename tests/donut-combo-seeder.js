const { Db } = require('mongodb');

/**
 * Seed the in-memory db using the Mix 1.
 * @param {Db} db Database to seed.
 */
module.exports.runMix1 = async (db) => {
    const collection = db.collection('donutCombos');
    await collection.insertMany(donutCombosSeedMix1);
}

/**
 * Seed the in-memory db using the Mix 2.
 * @param {Db} db Database to seed.
 */
module.exports.runMix2 = async (db) => {
    const collection = db.collection('donutCombos');
    await collection.insertMany(donutCombosSeedMix2);
}

const donutCombosSeedMix1 = [{
    name: 'B&W',
    active: true,
    donuts: [
        { color: 'white', glazing: true },
        { color: 'chocolate', glazing: true }
    ]
},
{
    name: 'Mix',
    active: true,
    donuts: [
        { color: 'white', glazing: true },
        { color: 'pink', glazing: true },
        { color: 'blue', glazing: true },
        { color: 'chocolate', glazing: true }
    ]
},
{
    name: 'No Choco',
    active: false,
    donuts: [
        { color: 'blue', glazing: true },
        { color: 'pink', glazing: true },
        { color: 'white', glazing: true }
    ]
}];

const donutCombosSeedMix2 = [{
    name: 'B&W',
    active: true,
    donuts: [
        { color: 'white', glazing: true },
        { color: 'white', glazing: true },
        { color: 'chocolate', glazing: true }
    ]
},
{
    name: 'Mix',
    active: true,
    donuts: [
        { color: 'pink', glazing: true },
        { color: 'white', glazing: true },
        { color: 'blue', glazing: true },
        { color: 'chocolate', glazing: true }
    ]
},
{
    name: 'Just colors',
    active: false,
    donuts: [
        { color: 'blue', glazing: true },
        { color: 'pink', glazing: true },
        { color: 'pink', glazing: true }
    ]
}];