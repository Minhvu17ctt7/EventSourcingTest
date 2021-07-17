const es = require('eventstore');

function create() {
  return es({
    type: 'mongodb',
    host: 'localhost',                          // optional
    port: 27017,                                // optional
    dbName: 'test_eventstore',                  // optional
    eventsCollectionName: 'events',             // optional
    snapshotsCollectionName: 'snapshots',       // optional
    transactionsCollectionName: 'transactions', // optional
    timeout: 10000 ,                             // optional
  // maxSnapshotsCount: 3                        // optional, defaultly will keep all snapshots
  authSource: 'admin',        // optional
    username: 'admin',                // optional
   password: 'admin',                         // optional
    //  url: 'mongodb+srv://root:root@cluster0.hmp16.mongodb.net/Banking?retryWrites=true&w=majority'
  // positionsCollectionName: 'positions' // optioanl, defaultly wont keep position
  });
}

// gio sao ko thi de t bat ubuntu len

module.exports = create;
