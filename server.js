var express = require('express')
var AWS = require('aws-sdk')
var fs = require('fs')
var s3 = new AWS.S3();

// For details and examples about AWS Node SDK,
// please see https://aws.amazon.com/sdk-for-node-js/

var myBucket = 'cs499-romero';
var app = express()

// This is how your enable CORS for your web service
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/list', function(req, res){
	var params = {
	  Bucket: myBucket	  
	};
	s3.listObjects(params, 	function(err, data){	  
	  for(var i = 0; i < data.Contents.length; i++) {
	  	data.Contents[i].Url = 'https://s3-us-west-1.amazonaws.com/' + data.Name + '/' + data.Contents[i].Key;
	  }	  
	  res.send(data.Contents);
	})
})

app.listen(3000, function () {
  console.log('Example app listening on port 80!');
});
