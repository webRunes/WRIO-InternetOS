#!/bin/bash
rm -fr node_modules

echo "Gzipping scripts"

gzip -9 start.js
mv start.js.gz start.js

gzip -9 start.js.map
mv start.js.map.gz start.js.map

gzip -9 main.js
mv main.js.gz main.js

gzip -9 main.js.map
mv main.js.map.gz main.js.map