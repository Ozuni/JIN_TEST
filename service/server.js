const express = require('./express');
const mongo = require('./mongo');

async function start() {
  mongo.start();
  express()
}

async function stop() {
  mongo.stop();
}

module.exports = {
  start,
  stop
};
