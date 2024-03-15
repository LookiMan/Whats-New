#!/bin/bash

if [ $NODE_ENV = "development" ];
then
    yarn add --dev
    yarn run watch
else
    yarn add
    yarn run migration:run
    yarn run start
fi
