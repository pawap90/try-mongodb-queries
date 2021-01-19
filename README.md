# try-mongodb-queries
A simple project to try MongoDB queries in memory using Jest. 
Includes a logger that logs the difference between the original test data and the data after the update using diff syntax highlight:

![The difference of a MongoDB document after being updated](https://i.imgur.com/8yGmVkY.png)

# Dependencies
What you need to run this project:
- Node.js

(MongoDB is not required because it'll run in memory, handled by the package `mongodb-memory-server-core`).

# Try it out
## 1. Install dependencies
```
npm install
```

## 2. Run tests
```
npm test
```

# Tools
Main tools used in this project:

- [MongoDB Node driver](https://docs.mongodb.com/drivers/node/)
- [Jest](https://jestjs.io/)
- [mongodb-memory-server package by @nodkz](https://github.com/nodkz/mongodb-memory-server)
