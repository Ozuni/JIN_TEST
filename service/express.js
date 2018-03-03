const express = require('express');
const mongo = require('./mongo');
let app = express();
const port = 8080;

const infoKeys = {
  '#': true,
  '@': true,
  ':': false,
}

function removeEmpty(data, keys, n) {
  if (!data[keys[n]])
  {
    delete data[keys[n]];
    return true;
  }
  return false;
}

function removeIllegal(data, key) {
  return (Object.keys(infoKeys).some((info) => {
    if ((infoKeys[info] === true && key.indexOf(info) === 0) ||
        (infoKeys[info] === false && key.indexOf(info) >= 0))
    {
      delete data[key];
      return true;
    }
  }));
}

function removeSimilar(data, keys, n) {
  for (let i = n + 1; i < keys.length; i++)
  {
    if (keys[n].toLowerCase() === keys[i].toLowerCase() &&
      data[keys[n]] === data[keys[i]])
    {
      delete data[keys[i]];
      return true;
    }
  }
  return false;
}

function normalize(data) {
  data = data.meta ? data.meta : data;
  let keys = Object.keys(data);

  for (let n = 0; n < keys.length; n++)
  {
    let removed = false;
    removed = removeEmpty(data, keys, n)

    if (!removed)
    {
      removed = removeIllegal(data, keys[n]);
    }

    if (!removed)
    {
      removeSimilar(data, keys, n)
    }
  }
  return data;
}

/*
**
** Function used to recover the data from the POST and send it to the database
**
*/
async function parsePostRSS(req, res) {
  let itemList = req.body.itemList;

  itemList = itemList.map((item) => {
    return normalize(item);
  })
  await mongo.postData(itemList);
  res.send('OK');
}

/*
**
** Start the express server
**
*/
module.exports = function () {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.post('/postRSS', parsePostRSS)

  app.listen(port);
}
