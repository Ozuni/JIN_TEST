# JIN_TEST

## Dependencies

* Git
* Nodejs 8.X
* Mongodb 3.X

## Install

1. Run `npm install`

## Launch

1. Run `node service/index.js`
1. Run `node worker/index.js`


## Folder organization

| Folder  | Description                                       |
|:--------|:--------------------------------------------------|
| service | API: Recieves data and saves to Database          |
| worker  | Recieves data through RSS and sens to service API |
