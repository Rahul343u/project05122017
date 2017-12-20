var express = require('express');
var app = express();
var itemRouter = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://10.13.69.239:27017/automationframework";
var ObjectId = require('mongodb').ObjectID;
var actiondetails;
var Output =[];

itemRouter.route('/getTestcastags').post(function (req,res)
{
	MongoClient.connect(url, function(err, db)
			{
				if (err) throw err;
					db.collection("testcaseTags").find({"project": req.body.project_id}).toArray(function(err, tags)
					{
						if (err) throw err;
						//console.log(tags);
						res.send({testtagname:tags});
					});
			});
});



itemRouter.route('/post').post(function (req,response)
{
	MongoClient.connect(url, function(err, db)
	{


			//joining collections
			db.collection("projects").find({}).toArray(function(err, proje)
			{
				if (err) throw err;
				db.collection("testcases").aggregate([
					{ $match : { "tag" : req.body.Testcasetag } },
					{ "$unwind" : "$collection"}
					,
					{
					$lookup:{
					from:"actions",
					localField:"collection.actionid",
					foreignField:"temp",
					as:"details"
					}
					},
					{ "$unwind" : "$details"},
					{
					$group:{
					"_id" : "$_id",
					"name": { "$first": "$name" },
					"description": { "$first": "$description" },
					"actiondetails": { "$push": "$details" },

					},
					}



				],function(err,res)
				{
					if (err) throw err;
					//console.log(req.body.languages);
					console.log(res);
					response.render('item',{res:res,proje:proje});

				});

			});


	});


});


itemRouter.route('/single').get(function (req, res) {
  res.render('singleItem');
});

itemRouter.route('/add').get(function (req, res) {
  res.render('addItem');
});

itemRouter.route('/add/post').post(function (req, res) {
  var item = new Item(req.body);
      item.save()
    .then(item => {
    res.redirect('/');
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });
});
module.exports = itemRouter;