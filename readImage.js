var mongodb = require('mongodb');
var mongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var url = "mongodb://localhost:27017/mydb";

mongoClient.connect(url, function(err, db) {
    if (err) {
        console.log('Sorry unable to connect to MongoDB Error:', err);
    } else {

        var bucket = new mongodb.GridFSBucket(db, {
            chunkSizeBytes: 1024,
            bucketName: 'images'
        });

        bucket.openDownloadStreamByName('me.png').pipe(
              fs.createWriteStream('D:\\TestDev\\NodeJS coding\\images\\Download1\\me.png')).on('error',
              function(error) {
                  console.log('Error:-', error);
              }).on('finish', function() {
              console.log('done!');
              process.exit(0);
          });
    }
});
