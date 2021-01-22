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

describe('filtered positional operator', () => {

    it('db can be seeded', async () => {
        await seeder.runMix2(db);

        expect(await donutCombosCollection.countDocuments({})).toBe(3);
    });

    it('can change every white donut color to green in every active document', async () => {
        await seeder.runMix2(db);

        const initialDonutCombos = await donutCombosCollection.find({ }).toArray();

        /** @type {import('mongodb').UpdateWriteOpResult} */
        const result = await donutCombosCollection.updateMany({ active: true }, { 
            $set: { 
                "donuts.$[donut].color": "green" 
            } 
        }, 
        { 
            arrayFilters: [{ "donut.color": "white" }] 
        });

        expect(result.modifiedCount).toBe(2);

        const modifiedDonutCombos = await donutCombosCollection.find({ }).toArray();

        expect(modifiedDonutCombos[0].donuts[0].color).toBe('green');
        expect(modifiedDonutCombos[0].donuts[1].color).toBe('green');
        expect(modifiedDonutCombos[0].donuts[2].color).toBe('chocolate');
        expect(modifiedDonutCombos[1].donuts[0].color).toBe('pink');
        expect(modifiedDonutCombos[1].donuts[1].color).toBe('green');
        expect(modifiedDonutCombos[1].donuts[2].color).toBe('blue');
        expect(modifiedDonutCombos[1].donuts[3].color).toBe('chocolate');

        await logger.printDifference(expect.getState().currentTestName, initialDonutCombos, modifiedDonutCombos);
    });

    it('can remove the color of the all white donuts in every document', async () => {
        await seeder.runMix2(db);

        const initialDonutCombos = await donutCombosCollection.find({ }).toArray();

        /** @type {import('mongodb').UpdateWriteOpResult} */
        const result = await donutCombosCollection.updateMany({ active: true }, { 
            $unset: { 
                "donuts.$[donut].color": 1
            } 
        }, 
        { 
            arrayFilters: [{ "donut.color": "white" }] 
        });

        expect(result.modifiedCount).toBe(2);

        const modifiedDonutCombos = await donutCombosCollection.find({ }).toArray();

        expect(modifiedDonutCombos[0].donuts[0].color).not.toBeDefined();
        expect(modifiedDonutCombos[0].donuts[1].color).not.toBeDefined();
        expect(modifiedDonutCombos[0].donuts[2].color).toBe('chocolate');
        expect(modifiedDonutCombos[1].donuts[0].color).toBe('pink');
        expect(modifiedDonutCombos[1].donuts[1].color).not.toBeDefined();
        expect(modifiedDonutCombos[1].donuts[2].color).toBe('blue');
        expect(modifiedDonutCombos[1].donuts[3].color).toBe('chocolate');

        await logger.printDifference(expect.getState().currentTestName, initialDonutCombos, modifiedDonutCombos);
    });
});

