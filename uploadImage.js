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

        fs.createReadStream('D:\\TestDev\\NodeJS coding\\images\\me.png').pipe(
            bucket.openUploadStream('me.png')).on('error', function(error) {
            console.log('Error:-', error);
        }).on('finish', function() {
            console.log('File Inserted!!');
            process.exit(0);
        });
    }
});
