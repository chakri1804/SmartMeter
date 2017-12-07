"use strict";
var express = require('express');
var router = express.Router();
let google = require('googleapis');
let authentication = require("../authentication");
// var time = require('time');
var date = require('node-datetime');
//let date = require('date-and-time');
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
  var dt = date.create();
  currentMonth=dt.format('m');
  if(currentMonth!=previousMonth){
    numberofBlinks=-1;
    previousMonth=currentMonth;
  }
  numberofBlinks++;
  numberofUnits = numberofBlinks/unitFactor;
  amountConsumed += calcuteAmount(numberofUnitsp,numberofUnits);
  amountConsumed = parseFloat(amountConsumed.toFixed(2));
  amountLeft = thresholdAmount - amountConsumed;
  numberofUnitsp = numberofUnits;
  totalunits=calculateUnits(amountLeft);
  daysLeft=totalunits;
  if(daysLeft>31)
  {
    daysLeft="No Worries";
  }
  // now = new time.Date();
  // now = new Date();
  
  // date.format(now, 'HH:mm:ss'); 
  // now.setTimezone('Asia/Calcutta');
  // now.toString();
  // now = new Date().format("HH:mm:ss M-d");
  var formatted = dt.format('m/d/Y H:M:S');
  authentication.authenticate().then((auth)=>{
      appendData(auth,formatted,numberofUnits,amountConsumed);
  });
  console.log("Blinks : " + numberofBlinks,"Power Consumed : " + numberofUnits,"Cost : " + amountConsumed,"Left : " + amountLeft);
});
router.get('/toggle1', function(req, res, next) {
	bulb1On = !bulb1On;
	console.log('bulb 1 toggle');
	 res.writeHead(301,{'Location' : 'http://192.168.1.3/'});
});
router.get('/toggle2', function(req, res, next) {
  bulb2On = !bulb2On;
  console.log('bulb 2 toggle');
  res.writeHead(301,{'Location' : 'http://192.168.1.3/'});
});
router.get('/api/getParams', function (req, res, next) {
	// console.log('api amountConsumed requested');
	var json = JSON.stringify({ 
	    amountConsumed: amountConsumed, 
	    budget: thresholdAmount, 
	    amountLeft: amountLeft,
      units: daysLeft 
	});
	res.send(json);
	// console.log(json);
});

router.post('/api/updateBudget', function (req, res, next) {
	console.log(req.body);
	thresholdAmount = parseFloat(req.body.inputBudget);
	amountLeft = thresholdAmount - amountConsumed;
  totalunits=calculateUnits(amountLeft);
  daysLeft=totalunits;
	if(daysLeft>31)
  {
    daysLeft="No Worries";
  }
  // amountConsumed = 0;
	res.redirect('/');
})

router.post('/api/switching', function (req, res, next) {

 if(bulb1On){
    resstring="1";
    res.send(resstring);
  } else {
    resstring="0";  
    res.send(resstring);
  }
})
router.post('/api/switching2', function (req, res, next) {

 if(bulb2On){
    resstring1="1";
    res.send(resstring1);
  } else {
    resstring1="0";       
    res.send(resstring1);
  }

  // amountConsumed = 0;
 // res.redirect('/maps.html');
})

module.exports = router;

// Code for ESPRequest

var numberofBlinks = 0;
var resstring="0";
var resstring1="0";
var unitFactor = 2; // No of Blinks Equal 1 unit
var budget;
var numberofUnits = 0 , numberofUnitsp = 0;
var daysLeft=0;
var amountConsumed = 0;
var currentMonth,previousMonth=0;
var thresholdAmount = 100;

var amountLeft = thresholdAmount;
var totalunits=0;
var costSlab1 = 10 , costSlab2 = 15 , costSlab3 = 20 ;
// Function to calcute cost
var value = 0;
var bulb1On=0;
var bulb2On=0;
var now;

function calcuteAmount(numberofUnitsp , numberofUnits) {
	value = 0;
	if (numberofUnits == numberofUnitsp) {
		return value;
	}	
	else if (numberofUnits <= costSlab1) {
		value = 1.45;
	}
	else if (numberofUnits <= costSlab2) {
		value = 2.6;
	}
	else if (numberofUnits <= costSlab3) {
		value = 3.6;
	}
	else {
		value = 6.9;
	}

	return value;
}
function calculateUnits(amountLeft){
  var i;
  budget=amountLeft;
    if(budget-14.5>0){
      if(budget-14.5-5*2.6>0)
      {
        if(budget-14.5-5*2.6-5*3.6>0)
        {
          for(i=0;budget-14.5-5*2.6-5*3.6-i*6.9>0;i++);
          return i+20;
        }
        else
        {
          for(i=0;budget-14.5-5*2.6-i*3.6>0;i++);
          return i+15;  
        }
      }
      else{
        for(i=0;budget-14.5-i*2.6>0;i++);
        return i+10;
      }
    }
    else{
        for(i=0;budget-i*4.5>0;i++);
        return i;
      }
} 
function appendData(auth,time,units,cost) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.append({
    auth: auth,
    spreadsheetId: '1jtV-MedaJkXjiDfeUnf-HNGHyG3BDAbNt6sw654iFZA',
    range: 'Sheet2!A2:C', //Change Sheet1 if your worksheet's name is something else
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
 
