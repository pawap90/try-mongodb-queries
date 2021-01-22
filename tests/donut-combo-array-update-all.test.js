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

describe('all positional operator', () => {

    it('db can be seeded', async () => {
        await seeder.runMix2(db);

        expect(await donutCombosCollection.countDocuments({})).toBe(3);
    });

    it('can set the glazing as false for all donuts in every active document', async () => {
        await seeder.runMix2(db);

        const initialDonutCombos = await donutCombosCollection.find({ }).toArray();

        /** @type {import('mongodb').UpdateWriteOpResult} */
        const result = await donutCombosCollection.updateMany({ active: true }, {  
            $set: {  
                'donuts.$[].glazing': false 
            }  
        });

        expect(result.modifiedCount).toBe(2);

        const modifiedDonutCombos = await donutCombosCollection.find({ }).toArray();

        for (const key in modifiedDonutCombos) {
            const donutCombo = modifiedDonutCombos[key];
            
            for (const donutKey in donutCombo.donuts) {
                const donut = donutCombo.donuts[donutKey];

                if(donutCombo.active)
                    expect(donut.glazing).toBe(false);
                else 
                    expect(donut.glazing).toBe(true);
            }
        }

        await logger.printDifference(expect.getState().currentTestName, initialDonutCombos, modifiedDonutCombos);
    });

    it('can remove the glazing of the all donuts in every active document', async () => {
        await seeder.runMix2(db);

        const initialDonutCombos = await donutCombosCollection.find({ }).toArray();

        /** @type {import('mongodb').UpdateWriteOpResult} */
        const result = await donutCombosCollection.updateMany({ active: true }, { 
            $unset: { 
                'donuts.$[].glazing': 1 
            } 
        });

        expect(result.modifiedCount).toBe(2);

        const modifiedDonutCombos = await donutCombosCollection.find({ }).toArray();

        for (const key in modifiedDonutCombos) {
            const donutCombo = modifiedDonutCombos[key];
            
            for (const donutKey in donutCombo.donuts) {
                const donut = donutCombo.donuts[donutKey];

                if(donutCombo.active)
                    expect(donut.glazing).not.toBeDefined();
                else 
                    expect(donut.glazing).toBeDefined();
            }
        }

        await logger.printDifference(expect.getState().currentTestName, initialDonutCombos, modifiedDonutCombos);
    });
});

