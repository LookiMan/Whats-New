#!/bin/bash

if [ $NODE_ENV = "development" ];
then
    npm install
    npm run watch
else
    npm install --save-dev
    npm run migration:run
    npm run start
fi
