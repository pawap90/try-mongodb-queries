'use strict';

const { MongoClient, Db } = require("mongodb");
const { MongoMemoryServer } = require('mongodb-memory-server-core');

/** @type {MongoClient} */
let connection;

/** @type {Db} */
let database;

/** @type {MongoMemoryServer} */
let mongoServer;

/**
 * Connect to the in-memory database.
 * @returns {Db} The in-memory database instance.
 */
module.exports.connect = async () => {

    mongoServer = new MongoMemoryServer();
    const uri = await mongoServer.getUri();

    const mongoOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    connection = await MongoClient.connect(uri, mongoOptions);
    database = connection.db(await mongoServer.getDbName());

    return database;
};

/**
 * Drop database, close the connection and stop mongod.
 */
module.exports.closeDatabase = async () => {
    if (connection)
        connection.close();

    if (mongoServer)
        await mongoServer.stop();
};

/**
 * Remove all the data for all db collections.
 */
module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
};