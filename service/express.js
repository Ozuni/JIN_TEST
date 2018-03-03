const express = require('express');
const mongo = require('./mongo');
let app = express();
const port = 8080;

const infoKeys = {
  '#': true,
  '@': true,
  'meta': true,
  ':': false,
}

function remove(data, key)
{
  delete data[key];
  return true;
}

function removeEmpty(data, key) {
  if (!data[key])
  {
    return remove(data, key);
  }
  if (Array.isArray(data[key]) && data[key].length === 0)
  {
    return remove(data, key);
  }
  if (typeof data[key] === 'object' && Object.keys(data[key]).length === 0)
  {
    return remove(data, key);
  }
  return false;
}

function removeIllegal(data, key) {
  return (Object.keys(infoKeys).some((info) => {
    if ((infoKeys[info] === true && key.indexOf(info) === 0) ||
        (infoKeys[info] === false && key.indexOf(info) >= 0))
    {
      return remove(data, key);
    }
  }));
}

function removeSimilar(data, keys, n) {
  for (let i = n + 1; i < keys.length; i++)
  {
    if (keys[n].toLowerCase() === keys[i].toLowerCase() &&
      data[keys[n]] === data[keys[i]])
    {
      return remove(data, keys[i]);
    }
  }
  return false;
}

function normalize(data) {
  let keys = Object.keys(data);

  for (let n = 0; n < keys.length; n++)
  {
    let removed = false;
    removed = removeEmpty(data, keys[n]);

    if (!removed)
    {
      removed = removeIllegal(data, keys[n]);
    }

    if (!removed)
    {
      removeSimilar(data, keys, n);
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
