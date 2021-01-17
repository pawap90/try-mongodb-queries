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

describe('pull operator', () => {

    it('db can be seeded', async () => {
        await seeder.run(db);

        expect(await donutCombosCollection.countDocuments({})).toBe(3);
    });

    it('can pull a filtered set of donuts from the array', async () => {
        await seeder.run(db);

        const initialDonutCombos = await donutCombosCollection.find({ active: true }).toArray();

        await donutCombosCollection.updateMany({ active: true }, {
            $pull: { 
                donuts: { color: 'white' } 
            } 
        });

        const modifiedDonutCombos = await donutCombosCollection.find({ active: true }).toArray();

        expect(modifiedDonutCombos.length).toBe(2); // Only 2 document matches with active = true

        expect(modifiedDonutCombos[0].donuts.length).toBe(1);
        expect(modifiedDonutCombos[1].donuts.length).toBe(3);

        expect(modifiedDonutCombos[0].donuts[0].color).toBe('chocolate');
        expect(modifiedDonutCombos[1].donuts[0].color).toBe('pink');

        await logger.printDifference(expect.getState().currentTestName, initialDonutCombos, modifiedDonutCombos);
    });
});

