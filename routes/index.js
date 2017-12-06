"use strict";
var express = require('express');
var router = express.Router();
let google = require('googleapis');
let authentication = require("../authentication");
// var time = require('time');
var dateTime = require('node-datetime');
let date = require('date-and-time');
// var format = require("node.date-time");
var path = __dirname

// var dt = dateTime.create();
// dt.format('H:M:S');

/* GET home page. */
router.get('/', function(req, res, next) {
	// console.log(format("Y-MM-dd HH:mm:SS", new Date()));

  // res.render('index', { title: 'Cool, huh!', condition: false });
  // res.sendFile(path + '../public/index.html');
});

/* GET users listing. */
router.get('/users', function(req, res, next) {
	// console.log(format("Y-MM-dd HH:mm:SS", new Date()));
	// console.log(format("y-M-d H:m:s")); // 16-5-18 15:45:8 
	// console.log(new Date().format("Y-M-d H:m:s")); // 2016-5-18 
  res.send('respond with a resource ok!!');
});

router.get('/users/detail', function(req, res, next) {
  res.send('detail');
});

router.get('/api/gotblink', function(req, res, next) {
  res.send(200);
  numberofBlinks++;
  numberofUnits = numberofBlinks/unitFactor;
  amountConsumed += calcuteAmount(numberofUnitsp,numberofUnits);
  amountConsumed = parseFloat(amountConsumed.toFixed(2));
  amountLeft = thresholdAmount - amountConsumed;
  numberofUnitsp = numberofUnits;
  // now = new time.Date();
  now = new Date();
  date.format(now, 'HH:mm:ss'); 
  // now.setTimezone('Asia/Calcutta');
  // now.toString();
  // now = new Date().format("HH:mm:ss M-d");
  authentication.authenticate().then((auth)=>{
      appendData(auth,now,numberofUnits,amountConsumed);
  });
  console.log("Blinks : " + numberofBlinks,"Power Consumed : " + numberofUnits,"Cost : " + amountConsumed,"Left : " + amountLeft);
});

router.get('/api/getParams', function (req, res, next) {
	// console.log('api amountConsumed requested');
	var json = JSON.stringify({ 
	    amountConsumed: amountConsumed, 
	    budget: thresholdAmount, 
	    amountLeft: amountLeft
	});
	res.send(json);
	// console.log(json);
});

router.post('/api/updateBudget', function (req, res, next) {
	console.log(req.body);
	thresholdAmount = parseFloat(req.body.inputBudget);
	amountLeft = thresholdAmount - amountConsumed;
	// amountConsumed = 0;
	res.redirect('/');
})

module.exports = router;

// Code for ESPRequest

var numberofBlinks = 0;

var unitFactor = 2; // No of Blinks Equal 1 unit

var numberofUnits = 0 , numberofUnitsp = 0;

var amountConsumed = 0;

var thresholdAmount = 100;

var amountLeft = 0;

var costSlab1 = 10 , costSlab2 = 15 , costSlab3 = 20 , costSlab4 = 25 ;
// Function to calcute cost
var value = 0;

var now;

function calcuteAmount(numberofUnitsp , numberofUnits) {
	value = 0;
	if (numberofUnits == numberofUnitsp) {
		return value;
	}	
	else if (numberofUnits < costSlab1) {
		value = 1.45;
	}
	else if (numberofUnits < costSlab2) {
		value = 2.6;
	}
	else if (numberofUnits < costSlab3) {
		value = 3.6;
	}
	else if (numberofUnits < costSlab4) {
		value = 6.9;
	}
	return value;
}
 
function appendData(auth,time,units,cost) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.append({
    auth: auth,
    spreadsheetId: '1jtV-MedaJkXjiDfeUnf-HNGHyG3BDAbNt6sw654iFZA',
    range: 'Sheet1!A2:C', //Change Sheet1 if your worksheet's name is something else
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [ [time, units, cost]]
    }
  }, (err, response) => {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    } else {
        console.log("Appended");
    }
  });
}
 
