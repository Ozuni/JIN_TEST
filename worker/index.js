const cluster = require('cluster');
const feedparsing = require('./feedparsing');
const port = 8080;

const sources = [
  'http://www.jeuxvideo.com/rss/rss.xml',
  'http://www.jeuxvideo.com/rss/rss-news.xml',
  'http://www.jeuxvideo.com/rss/itunes-chroniques.xml',
  'https://news.google.com/news?ned=fr&num=100&output=rss&q=(%22starwars%22)',
  'http://www.jeuxvideo.com/rss/rss-videos.xml',
  'http://www.numerama.com/feed',
  'https://news.ycombinator.com/rss',
]

if (cluster.isMaster)
{
  for (let n = 0; n < sources.length - 1; n++)
  {
    let customEnv = Object.assign({}, process.env);
    customEnv.SOURCE_ID = n;
    cluster.fork(customEnv);
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${process.pid} died`)
  })

  console.log(`Master ${process.pid} started`)

  feedparsing(sources[sources.length - 1], port);
}
else
{
  console.log(`Worker ${process.pid} started`)

  feedparsing(sources[process.env.SOURCE_ID], port);
}
