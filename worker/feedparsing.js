const FeedParser = require('feedparser');
const request = require('request');
const cluster = require('cluster');

function logging(info, data) {
  console.log(`${process.pid} ${info}: ${data}`);
}

module.exports = function(url, port) {
  logging('reading source', url);

  let req = request(url);
  let feed = new FeedParser();

  req.on('error', (data) => {
    logging('error', data)
  });

  req.on('response', (resp) => {
    const stream = this;

    if (resp.statusCode !== 200)
    {
      return this.emit('error', new Error('Bad status code'));
    }
    req.pipe(feed);
  });

  feed.on('error', (data) => {
    logging('error', data)
  });

  feed.on('readable', () => {
    let itemList = [];
    let item = feed.read();

    while (item)
    {
      itemList.push(item);
      logging('item', item);
      item = feed.read();
    }

    if (itemList.length === 0)
    {
      return ;
    }
    request.post(
      `http://localhost:${port}/postRSS`, {
        json: {
          itemList
        }
      },
      (error, response, body) => {
        if (error)
        {
          return logging('POST failed', error);
        }
        logging('POST success', body);
      }
    );
  });
}
