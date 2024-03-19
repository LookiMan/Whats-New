#!/bin/bash

if [ $NODE_ENV = "development" ];
then
    yarn install --dev
    yarn run watch
else
    yarn install
    if yarn run build;
    then
        yarn run migration:run
        yarn run start
    else
        echo "Build failed. Exiting..."
        exit 1
    fi
fi
