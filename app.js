//Hackathon
var AWS = require('aws-sdk')
var s3 = new AWS.S3()
var fs = require('fs')


var myBucket = 'cs499-romero'

fs.watch('./', function (event, filename) {
    console.log('event is: ' + event);
    if (filename) {
        console.log('filename provided: ' + filename);
        if(event == 'rename'){
        	checkIfFile(filename, function(err, isFile) {
        		if (isFile) {
    				// handle the file
    				console.log("File exists");
    				uploadFileToS3(filename);
    			} else{
    				console.log("File deleted")
    				deleteFromS3(filename);
    			}
    		});      	
    	}

    	if(event == 'change'){
    		uploadFileToS3(filename);
    	}

    } else {
        console.log('filename not provided');
    }

});

function checkIfFile(file, cb) {
	fs.stat(file, function fsStat(err, stats) {
		if (err) {
			if (err.code === 'ENOENT') {
				return cb(null, false);
			} else {
				return cb(err);
			}
		}
		return cb(null, stats.isFile());
	});
}

function deleteFromS3 (fileKey) {
	params = {Bucket: myBucket, Key: fileKey};

	s3.deleteObject(params, function(err, data) {
  		if (err) {
  			console.log('error occurred - ' , err);
  		} else {
  			console.log('successfully deleted from s3.');
  		}
	});
}

function uploadFileToS3(filepath) {
	fs.readFile(filepath, function (err, data) {
		params = {Bucket: myBucket, Key: filepath, Body: data, ACL: "public-read"};
	    s3.putObject(params, function(err, data) {
	         if (err) {
	             console.log(err)
	         } else {
	             console.log("Successfully uploaded data to " + myBucket, data);
	         }
	    });
	});
}
