const { MongoClient } = require('mongodb');

const dbName = 'JIN';
let client = null;
let db = null;

async function start() {
  if (client !== null)
  {
    return ;
  }
  client = await MongoClient.connect('mongodb://localhost:27017');
  db = client.db(dbName);
}

async function stop() {
  if (client === null)
  {
    return ;
  }
  client.close(() => {
    client = null;
  });
}

async function postData(data) {
  await db.collection('data').insertMany(data);
}

module.exports = {
  start,
  stop,
  postData
}
