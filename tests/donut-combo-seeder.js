const { Db } = require('mongodb');

/**
 * Seed the in-memory db.
 * @param {Db} db Database to seed.
 */
module.exports.run = async (db) => {
    const collection = db.collection('donutCombos');
    await collection.insertMany(donutCombosSeed);
}

const donutCombosSeed = [{
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
    active: true,
    donuts: [
        { color: 'blue', glazing: true },
        { color: 'pink', glazing: true },
        { color: 'white', glazing: true }
    ]
}];