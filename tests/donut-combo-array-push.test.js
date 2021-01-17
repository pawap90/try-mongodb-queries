'use strict';

const { Db, Collection } = require('mongodb');

const dbHandler = require('./db-handler');
const logger = require('./logger');
const seeder = require('./donut-combo-seeder');

/** @type {Db} */
let db;

/** @type {Collection} */
let donutCombosCollection;

/** Connect to a new in-memory database before running any tests. */
beforeAll(async () => {
    db = await dbHandler.connect();
    donutCombosCollection = db.collection('donutCombos');
});

/** Clear all test data after every test. */
afterEach(async () => {
    await donutCombosCollection.drop();
});

/** Remove and close the db and server. */
afterAll(async () => {
    await dbHandler.closeDatabase();
});

describe('push operator', () => {

    it('db can be seeded', async () => {
        await seeder.run(db);

        expect(await donutCombosCollection.countDocuments({})).toBe(3);
    });

    it('can push a single donut to the end of the array', async () => {
        await seeder.run(db);

        const initialDonutCombo = await donutCombosCollection.findOne({ name: 'No Choco' });

        const pinkDonut = { color: 'pink', glazing: true };
        await donutCombosCollection.updateOne({ name: 'No Choco' }, {
            $push: {
                donuts: pinkDonut
            }
        });

        const modifiedDonutCombo = await donutCombosCollection.findOne({ name: 'No Choco' });

        expect(modifiedDonutCombo.donuts.length).toBe(4);
        expect(modifiedDonutCombo.donuts[3]).toStrictEqual(pinkDonut);

        await logger.printDifference(expect.getState().currentTestName, initialDonutCombo, modifiedDonutCombo);
    });

    it('can push a single donut into a specific position', async () => {
        await seeder.run(db);

        const initialDonutCombo = await donutCombosCollection.findOne({ name: 'No Choco' });

        const pinkDonut = { color: 'pink', glazing: true };
        await donutCombosCollection.updateOne({ name: 'No Choco' }, {
            $push: {
                donuts: {
                    $position: 2,
                    $each: [pinkDonut]
                }
            }
        });

        const modifiedDonutCombo = await donutCombosCollection.findOne({ name: 'No Choco' });

        expect(modifiedDonutCombo.donuts.length).toBe(4);
        expect(modifiedDonutCombo.donuts[2]).toStrictEqual(pinkDonut);

        await logger.printDifference(expect.getState().currentTestName, initialDonutCombo, modifiedDonutCombo);
    });

    it('can push multiple donuts', async () => {
        await seeder.run(db);

        const initialDonutCombo = await donutCombosCollection.findOne({ name: 'B&W' });

        const whiteDonut = { color: 'white', glazing: true };
        const pinkDonut = { color: 'pink', glazing: true };
        await donutCombosCollection.updateOne({ name: 'B&W' }, {
            $push: {
                donuts: {
                    $each: [whiteDonut, pinkDonut]
                }
            }
        });

        const modifiedDonutCombo = await donutCombosCollection.findOne({ name: 'B&W' });

        expect(modifiedDonutCombo.donuts.length).toBe(4);
        expect(modifiedDonutCombo.donuts[2]).toStrictEqual(whiteDonut);
        expect(modifiedDonutCombo.donuts[3]).toStrictEqual(pinkDonut);

        await logger.printDifference(expect.getState().currentTestName, initialDonutCombo, modifiedDonutCombo);
    });
});

