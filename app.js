const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add this line
//Run this command npm install express body-parser fuel-rest 
//You will need Express.js to handle server requests and the Fuel SDK to interact with Marketing Cloud
const FuelRest = require('fuel-rest'); // 
const app = express();
const port = process.env.PORT || 3000;

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

function calculateNextSendTime(timezoneOffset, daytype, start_window, end_window) {
    const currentUTC = new Date();
    const offsetParts = timezoneOffset.split('.');
    const offsetHours = parseInt(offsetParts[0], 10);
    const offsetMinutes = parseInt(offsetParts[1], 10);
    const offsetTotalMinutes = (offsetHours * 60) + (offsetHours < 0 ? -(offsetMinutes * 0.6) : (offsetMinutes  * 0.6));
    console.log(`Started function calculateNextSendTime`);
    const startDateTimeUTC = combineDateTime(currentUTC, start_window, offsetTotalMinutes);
    const endDateTimeUTC = combineDateTime(currentUTC, end_window, offsetTotalMinutes);
    console.log(startDateTimeUTC);
    console.log(endDateTimeUTC);
    let nextSendDateTime = null;
    console.log(nextSendDateTime);

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
    console.log(`${hours} ${minutes} ${seconds}`);
    console.log(`Start function combineDateTime ${combinedDateTime}`);
    combinedDateTime.setUTCHours(parseInt(hours, 10), parseInt(minutes, 10) - offsetTotalMinutes, parseInt(seconds, 10));
    console.log(`End function setUTCHours ${combinedDateTime}`);
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
        console.log(req.body);[0]
	if (!inArguments || inArguments.length === 0) {
        	return res.status(400).send('Missing inArguments');
    	}
        const { timezoneOffset } = req.body.inArguments[0];
        const { start_window } = req.body.inArguments[1];
        const { end_window } = req.body.inArguments[2];
        const { daytype } = req.body.inArguments[3];
        console.log(req.body.inArguments[2]);
//	var outArgument1 ;	    
	const now = new Date();
	let nextSendTime = now.toLocaleString();
	let subscriberKey = "Name";    
        console.log(req.body);[0]
        console.log(timezoneOffset);
        console.log(daytype);
        console.log(start_window);
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

    	// Update the Data Extension
    	const updateDE = async () => {
	console.log("Started updating DE");
         const options = {
	 //console.log("Before taking up the auth values");
            auth: {
                clientId: "oeatad9l98yhgdxmmet4f52u", //process.env.CLIENT_ID,  // need to update client ID
                clientSecret: "PdiODfmj9InnyJnpjbYsVkbY", //process.env.CLIENT_SECRET, // need to update secret
                authUrl: "https://mczjnvsmqwr9kd91bfptvyhht3p1.auth.marketingcloudapis.com/", //process.env.AUTH_URL, // update auth URL
                accountId: "7281488", //process.env.ACCOUNT_ID // account ID
	 	//console.log("After taking up the auth values");
            }
         };

        const RestClient = new FuelRest(options);
 	console.log("RestClient declared");
    
	try {
            const response = await RestClient.patch({
                uri: '/hub/v1/dataevents/key:custDataMailOpt/rowset',
	 	//console.log("Inside patch");
                headers: {
                    'Content-Type': 'application/json'
                },
                json: [{
                    keys: {
                        SubscriberKey: subscriberKey
                    },
                    values: {
                        nextSendTime: nextSendTime
                    }
                }]
            });
	 	console.log("Assiged ${subscriberKey} and ${nextSendTime} at rest API");

            res.status(200).send('Data Extension updated successfully');
        } catch (error) {
            res.status(500).send(`Error updating Data Extension: ${error.message}`);
        }    
	return res.status(200).send(JSON.stringify({ nextSendTime : nextSendTime}));    
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

// Start the server
app.listen(port, () => {
    console.log(`custom activity running on port ${port}`);
});
