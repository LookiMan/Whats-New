#!/bin/bash

if [ $NODE_ENV = "development" ];
then
    yarn install --dev
    yarn run watch
else
    yarn install
    yarn run build && yarn run migration:run
    yarn run start
fi
