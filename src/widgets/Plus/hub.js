require('cross-storage').CrossStorageHub.init([{
    origin: /.*/,
    allow: ['get', 'set', 'del']
}]);
