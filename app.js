const express = require('express');
const path = require('path');
var util = require('util');
var http = require('https');
var request = require("request");
const bodyParser = require('body-parser');
const cors = require('cors'); // Add this line
//Run this command npm install express body-parser fuel-rest 
//You will need Express.js to handle server requests and the Fuel SDK to interact with Marketing Cloud
const FuelRest = require('fuel-rest'); // 
const app = express();
const port = process.env.PORT || 3000;
exports.logExecuteData = [];
function logData(req) {
    exports.logExecuteData.push({
        body: req.body,
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path,
        host: req.hostname,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });
    console.log("body: " + util.inspect(req.body));
    console.log("headers: " + req.headers);
    console.log("trailers: " + req.trailers);
    console.log("method: " + req.method);
    console.log("url: " + req.url);
    console.log("params: " + util.inspect(req.params));
    console.log("query: " + util.inspect(req.query));
    console.log("route: " + req.route);
    console.log("cookies: " + req.cookies);
    console.log("ip: " + req.ip);
    console.log("path: " + req.path);
    console.log("host: " + req.hostname);
    console.log("fresh: " + req.fresh);
    console.log("stale: " + req.stale);
    console.log("protocol: " + req.protocol);
    console.log("secure: " + req.secure);
    console.log("originalUrl: " + req.originalUrl);
}

app.use(cors()); // Add this line
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
var activity = {};

activity.initialize = function() {
    connection.trigger('ready');
    $('#custom-activity-form').on('submit', activity.calculateNextSendTime);
    console.log(`Started Initialize in activity.js`);
};

activity.calculateNextSendTime = function(event) {
    event.preventDefault();

    console.log(`Started executing function: calculateNextSendTime`);
    var Name = $('#Name').val();
    var daytype = $('#daytype').val();
    var timezoneOffset = $('#timezoneOffset').val();
    var startWindow = $('#start_window').val();
    var endWindow = $('#end_window').val();

    // Validation
    if (!validateTimeFormat(startWindow) || !validateTimeFormat(endWindow) || startWindow === endWindow) {
        alert('Invalid input. Please check the time format and ensure start and end windows are different.');
        return;
    }

    var nextSendTime = calculateNextSendTime(timezoneOffset, daytype, startWindow, endWindow);
    $('#result').text('Next Send Time: ' + nextSendTime);
};

function calculateNextSendTime(timezoneOffset, daytype, start_window, end_window ) {
    const currentUTC = new Date();
    const offsetParts = timezoneOffset.split('.');
    const offsetHours = parseInt(offsetParts[0], 10) ;
    console.log(offsetHours);
    const offsetMinutes = parseInt(offsetParts[1], 10) || 0;
    console.log(offsetMinutes);
    const offsetTotalMinutes = (offsetHours * 60) + (offsetHours < 0 ? -(offsetMinutes * 0.6) : (offsetMinutes  * 0.6));
    console.log(`Started function calculateNextSendTime`);
    const startDateTimeUTC = combineDateTime(currentUTC, start_window, offsetTotalMinutes);
    const endDateTimeUTC = combineDateTime(currentUTC, end_window, offsetTotalMinutes);
    console.log(startDateTimeUTC);
    console.log(endDateTimeUTC);
    let nextSendDateTime = null;
    //console.log(nextSendDateTime);

    if (currentUTC <= startDateTimeUTC) {
	nextSendDateTime = startDateTimeUTC;
        console.log(nextSendDateTime);
    	console.log(`currentUTC <= startDateTimeUTC`);
    } else {
	nextSendDateTime = addDays(startDateTimeUTC, 1);
    	    console.log(nextSendDateTime);
            console.log(`currentUTC > startDateTimeUTC`);
    }

    if (daytype === 'weekday') {
	while (nextSendDateTime.getUTCDay() === 0 || nextSendDateTime.getUTCDay() === 6) {
    	    console.log(`daytype === weekday`);
	    console.log(nextSendDateTime);
	    nextSendDateTime = addDays(nextSendDateTime, 1);
	}
    }
    console.log(`about to return nextSendDateTime`);
    console.log(nextSendDateTime);
    return nextSendDateTime.toISOString();
}

function combineDateTime(date, time, offsetTotalMinutes) {
    const [hours, minutes, seconds] = time.split(':');
    const combinedDateTime = new Date(date.getTime());
    console.log(`${hours} ${minutes} ${seconds} ${offsetTotalMinutes}`);
    console.log(`Start function combineDateTime ${combinedDateTime}`);
    combinedDateTime.setUTCHours(parseInt(hours, 10), parseInt(minutes, 10) - offsetTotalMinutes, parseInt(seconds, 10));
    console.log(`End function combineDateTime ${combinedDateTime}`);
    return combinedDateTime;
}

function addDays(date, days) {
    const result = new Date(date);
    console.log(result);
    result.setUTCDate(result.getUTCDate() + days);
    console.log(result.getUTCDate());
    console.log(result);
    return result;
}

// Routes
app.post('/execute', (req, res) => {
    try {
        console.log("Starting the /execute");
        console.log(req.body);[0]
        console.log(req.body.keyValue);	
	//const { inArguments } = req.body;
	//if (!inArguments || inArguments.length === 0) {
        //	return res.status(400).send('Missing inArguments');
    	//}
        const { timezoneOffset } = req.body.inArguments[0];
        const { start_window } = req.body.inArguments[1];
        const { end_window } = req.body.inArguments[2];
        const { daytype } = req.body.inArguments[3];
        const { Name } = req.body.keyValue || "Key Not found" ;
//        console.log(req.body);
//	var outArgument1 ;	    
	const now = new Date();
	let nextSendTime = now.toLocaleString();
	let subscriberKey = Name || req.body.keyValue;    
        //console.log(Name);[0]
        console.log(timezoneOffset);
        console.log(daytype);
        console.log(start_window);
       // console.log(Name);
        nextSendTime = calculateNextSendTime(timezoneOffset, daytype, start_window, end_window);
        console.log('After the function call');
        //res.status(200).json({ nextSendTime : nextSendTime });
        //console.log(res.body);
	//return res.status(200).json({ nextSendTime : nextSendTime });	
        //res.status(200).send(JSON.stringify({ nextSendTime : nextSendTime}));
	if (nextSendTime|| nextSendTime.length > 0) {
		// nextSendTime has a value, proceed with your logic here
		console.log("Next send time is:", nextSendTime);
    	} else {
		// nextSendTime is empty or undefined, send error message
		console.log("Error in input params");
		nextSendTime = "Error in input params";
    	}    

	console.log("Started updating DE", subscriberKey);
	    
    	// Update the Data Extension
//    	const updateDE = async () => {
	 //console.log("Before taking up the auth values");
         const options = {
            auth: {
                clientId: "oeatad9l98yhgdxmmet4f52u", //process.env.CLIENT_ID,  // need to update client ID
                clientSecret: "PdiODfmj9InnyJnpjbYsVkbY", //process.env.CLIENT_SECRET, // need to update secret
                authUrl: "https://mczjnvsmqwr9kd91bfptvyhht3p1.auth.marketingcloudapis.com/", //process.env.AUTH_URL, // update auth URL
                accountId: "7281488", //process.env.ACCOUNT_ID // account ID
	 	//console.log("After taking up the auth values");
            }
         };

        const RestClient = new FuelRest(options);
 	console.log("RestClient declared",nextSendTime);
    
	try {
            //const response = RestClient.patch(
	    var response = {
                uri: '/hub/v1/dataevents/key:custDataMailOpt/rowset',
		method: 'POST',
		//url: 'https://mczjnvsmqwr9kd91bfptvyhht3p1.auth.marketingcloudapis.com/hub/v1/dataevents/key:custDataMailOpt/rowset',
	 	//console.log("Inside patch");
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json'
                },
                json: [{
                    keys: {
                        SubscriberKey: req.body.keyValue
                    },
                    values: {
                        nextSendTime: nextSendTime || "A"
                    }
                }]
            };
	    console.log("Assiged ", subscriberKey, " and " , nextSendTime, " at rest API");

	    return res.status(200).send(JSON.stringify({ nextSendTime : nextSendTime}));    
            
        } catch (error) {
	    console.log(response, "&&and&&&", error.message);
            res.status(500).send(`Error updating Data Extension: ${error.message}`);
        }    
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
    console.log(res);
});

app.post('/publish', (req, res) => {
    try {
	console.log(`publishing..`);
        res.sendStatus(200);
    } catch (error) {
        handleError(res, error);
    }
});

app.post('/validate', (req, res) => {
    try {
	    console.log(`Validated`);
	    console.log(JSON.stringify(req.body));
	    res.sendStatus(200);
     } catch (error) {
         handleError(res, error);
     }
});

app.post('/stop', (req, res) => {
    try {
	console.log(`Stopping`);
        res.sendStatus(200);
    } catch (error) {
        handleError(res, error);
    }
});

app.post('/save', (req, res) => {
    try {
	console.log(`Saving`);
        res.sendStatus(200);
    } catch (error) {
        handleError(res, error);
    }
});

app.post('/edit', (req, res) => {
    try {
	console.log(`Editing`);
        res.sendStatus(200);
    } catch (error) {
        handleError(res, error);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`custom activity running on port ${port}`);
});
