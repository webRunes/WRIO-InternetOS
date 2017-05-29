#!/bin/bash

# This scripts executed before deploy on Travis CI, it deletes node_modules, gzips all sources for quick download

cd build

echo "Gzipping scripts"

gzip -9 *.js *.map
for i in *.gz ; do mv "$i" "${i/.gz/}" ; done